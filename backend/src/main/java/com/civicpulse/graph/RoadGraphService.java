package com.civicpulse.graph;
import com.civicpulse.service.DuplicateDetectionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.*;

@Service
public class RoadGraphService {
    private Map<String, Node> nodes = new HashMap<>();
    private Map<String, List<Edge>> adjacency = new HashMap<>();

    @PostConstruct
    public void loadGraph() {
        try (InputStream is = new ClassPathResource("road_graph.json").getInputStream()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);
            
            for (JsonNode n : root.get("nodes")) {
                Node node = new Node();
                node.id = n.get("id").asText();
                node.lat = n.get("lat").asDouble();
                node.lng = n.get("lng").asDouble();
                nodes.put(node.id, node);
            }
            
            for (JsonNode e : root.get("edges")) {
                Edge edge = new Edge();
                edge.to = e.get("to").asText();
                edge.baseTravelTimeSeconds = e.get("baseTravelTimeSeconds").asDouble();
                edge.centralityScore = e.get("centralityScore").asDouble();
                edge.lengthMeters = e.get("lengthMeters").asDouble();
                edge.openFlaggedReports = 0;
                
                String from = e.get("from").asText();
                adjacency.computeIfAbsent(from, k -> new ArrayList<>()).add(edge);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public RouteResult findRoute(double fromLat, double fromLng, double toLat, double toLng, String mode) {
        String startId = nearestNode(fromLat, fromLng);
        String endId = nearestNode(toLat, toLng);
        java.util.function.ToDoubleFunction<Edge> costFn = mode.equals("safest") ? this::safestCost : this::fastestCost;
        return dijkstra(startId, endId, costFn, mode);
    }

    private double fastestCost(Edge e) { return e.baseTravelTimeSeconds; }
    private double safestCost(Edge e) {
        double severityFactor = 0.3;
        return e.baseTravelTimeSeconds * (1 + e.openFlaggedReports * severityFactor);
    }

    private RouteResult dijkstra(String startId, String endId,
            java.util.function.ToDoubleFunction<Edge> costFn, String mode) {
        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        PriorityQueue<String> pq = new PriorityQueue<>(
                Comparator.comparingDouble(n -> dist.getOrDefault(n, Double.MAX_VALUE)));
        dist.put(startId, 0.0);
        pq.add(startId);
        while (!pq.isEmpty()) {
            String u = pq.poll();
            if (u.equals(endId)) break;
            for (Edge e : adjacency.getOrDefault(u, List.of())) {
                double newDist = dist.getOrDefault(u, Double.MAX_VALUE) + costFn.applyAsDouble(e);
                if (newDist < dist.getOrDefault(e.to, Double.MAX_VALUE)) {
                    dist.put(e.to, newDist);
                    prev.put(e.to, u);
                    pq.add(e.to);
                }
            }
        }
        return buildResult(startId, endId, dist, prev, mode);
    }

    private RouteResult buildResult(String startId, String endId, Map<String, Double> dist, Map<String, String> prev, String mode) {
        List<RouteResult.PathNode> path = new ArrayList<>();
        String curr = endId;
        double distanceMeters = 0.0;
        int etaSeconds = 0;
        int flaggedStretchesCount = 0;

        if (!prev.containsKey(endId) && !startId.equals(endId)) {
            return new RouteResult(mode, 0.0, 0, null, null, Collections.emptyList());
        }

        while (curr != null) {
            Node n = nodes.get(curr);
            path.add(new RouteResult.PathNode(n.lat, n.lng, n.id));
            String p = prev.get(curr);
            if (p != null) {
                for (Edge e : adjacency.getOrDefault(p, List.of())) {
                    if (e.to.equals(curr)) {
                        distanceMeters += e.lengthMeters;
                        etaSeconds += e.baseTravelTimeSeconds;
                        if (e.openFlaggedReports > 0) flaggedStretchesCount++;
                        break;
                    }
                }
            }
            curr = p;
        }
        Collections.reverse(path);
        double distanceKm = distanceMeters / 1000.0;
        int etaMinutes = (int) Math.ceil(etaSeconds / 60.0);

        Integer detourVsFastestPercent = null;
        Integer flaggedStretchesAvoided = null;

        if (mode.equals("safest")) {
            RouteResult fastestResult = dijkstra(startId, endId, this::fastestCost, "fastest");
            
            int fastestFlaggedStretches = 0;
            int exactFastestEtaSeconds = 0;
            
            for (int i = 0; i < fastestResult.getPath().size() - 1; i++) {
                String u = fastestResult.getPath().get(i).getNodeId();
                String v = fastestResult.getPath().get(i+1).getNodeId();
                for (Edge e : adjacency.getOrDefault(u, List.of())) {
                    if (e.to.equals(v)) {
                        exactFastestEtaSeconds += e.baseTravelTimeSeconds;
                        if (e.openFlaggedReports > 0) fastestFlaggedStretches++;
                        break;
                    }
                }
            }
            
            if (exactFastestEtaSeconds > 0) {
                detourVsFastestPercent = (int) Math.round(((double)(etaSeconds - exactFastestEtaSeconds) / exactFastestEtaSeconds) * 100);
            } else {
                detourVsFastestPercent = 0;
            }
            flaggedStretchesAvoided = Math.max(0, fastestFlaggedStretches - flaggedStretchesCount);
        }

        return new RouteResult(mode, Math.round(distanceKm * 10.0) / 10.0, etaMinutes, detourVsFastestPercent, flaggedStretchesAvoided, path);
    }

    public double criticalityMultiplierFor(double lat, double lng) {
        String nodeId = nearestNode(lat, lng);
        if (nodeId == null) return 1.0;
        double maxCentrality = adjacency.getOrDefault(nodeId, List.of()).stream()
                .mapToDouble(e -> e.centralityScore).max().orElse(0.0);
        return 1.0 + maxCentrality;
    }

    private String nearestNode(double lat, double lng) {
        String bestId = null;
        double bestDist = Double.MAX_VALUE;
        for (Node n : nodes.values()) {
            double d = DuplicateDetectionService.haversineMeters(lat, lng, n.lat, n.lng);
            if (d < bestDist) {
                bestDist = d;
                bestId = n.id;
            }
        }
        return bestId;
    }

    static class Node { String id; double lat, lng; }
    static class Edge { String to; double baseTravelTimeSeconds, centralityScore, lengthMeters; int openFlaggedReports; }
}
