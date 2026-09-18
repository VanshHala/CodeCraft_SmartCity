package com.civicpulse.controller;

import com.civicpulse.repository.IssueClusterRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    private final IssueClusterRepository clusterRepository;
    private final com.civicpulse.repository.UserRepository userRepository;

    public AnalyticsController(IssueClusterRepository clusterRepository, com.civicpulse.repository.UserRepository userRepository) {
        this.clusterRepository = clusterRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/heatmap")
    @PreAuthorize("hasRole('AUTHORITY')")
    public List<Map<String, Object>> getHeatmap() {
        return clusterRepository.findAll().stream()
            .filter(c -> !"RESOLVED".equals(c.getStatus()))
            .map(c -> Map.of(
                "lat", (Object) c.getCentroidLat(),
                "lng", (Object) c.getCentroidLng(),
                "weight", (Object) c.getPriorityScore()
            ))
            .collect(Collectors.toList());
    }

    @GetMapping("/health-score")
    @PreAuthorize("hasRole('AUTHORITY')")
    public List<Map<String, Object>> getHealthScore() {
        List<com.civicpulse.model.IssueCluster> openClusters = clusterRepository.findAll().stream()
            .filter(c -> !"RESOLVED".equals(c.getStatus()))
            .collect(Collectors.toList());

        long potholeCount = openClusters.stream().filter(c -> "POTHOLE".equals(c.getIssueType())).count();
        long streetlightCount = openClusters.stream().filter(c -> "STREETLIGHT".equals(c.getIssueType())).count();
        long waterCount = openClusters.stream().filter(c -> "WATER".equals(c.getIssueType())).count();
        long garbageCount = openClusters.stream().filter(c -> "GARBAGE".equals(c.getIssueType())).count();
        long safetyCount = openClusters.stream().filter(c -> "SAFETY".equals(c.getIssueType())).count();

        int roadScore = 100 - (int) Math.min(100, potholeCount * 4);
        int lightingScore = 100 - (int) Math.min(100, streetlightCount * 5);
        int waterScore = 100 - (int) Math.min(100, waterCount * 6);
        int garbageScore = 100 - (int) Math.min(100, garbageCount * 3);
        int safetyScore = 100 - (int) Math.min(100, safetyCount * 8);
        int wardHealthScore = (roadScore + lightingScore + waterScore + garbageScore + safetyScore) / 5;

        return List.of(Map.of(
            "ward", "Central Ward",
            "roadScore", roadScore,
            "lightingScore", lightingScore,
            "waterScore", waterScore,
            "garbageScore", garbageScore,
            "safetyScore", safetyScore,
            "wardHealthScore", wardHealthScore
        ));
    }

    @GetMapping("/alerts")
    @PreAuthorize("hasRole('AUTHORITY')")
    public List<Map<String, String>> getAlerts() {
        List<Map<String, String>> alerts = new java.util.ArrayList<>();
        
        long waterCount = clusterRepository.findAll().stream()
            .filter(c -> "WATER".equals(c.getIssueType()) && !"RESOLVED".equals(c.getStatus()))
            .count();
            
        if (waterCount > 0) {
            try {
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                String url = "https://api.open-meteo.com/v1/forecast?latitude=23.03&longitude=72.58&daily=precipitation_sum&timezone=auto";
                Map response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.containsKey("daily")) {
                    Map daily = (Map) response.get("daily");
                    List<Number> precipitation = (List<Number>) daily.get("precipitation_sum");
                    if (precipitation != null) {
                        for (Number p : precipitation) {
                            if (p != null && p.doubleValue() > 40.0) {
                                alerts.add(Map.of(
                                    "message", "Heavy rainfall expected. Ward has " + waterCount + " drainage complaints — Flood Risk: HIGH.",
                                    "severity", "HIGH"
                                ));
                                break;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return alerts;
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('AUTHORITY')")
    public List<Map<String, Object>> getLeaderboard() {
        return userRepository.findTop10ByRoleOrderByRewardPointsDesc("CITIZEN").stream()
            .map(u -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("name", u.getName());
                map.put("points", u.getRewardPoints());
                return map;
            })
            .collect(Collectors.toList());
    }
}
