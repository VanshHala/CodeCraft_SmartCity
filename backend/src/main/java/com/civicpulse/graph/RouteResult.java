package com.civicpulse.graph;
import java.util.List;

public class RouteResult {
    private String mode;
    private double distanceKm;
    private int etaMinutes;
    private Integer detourVsFastestPercent;
    private Integer flaggedStretchesAvoided;
    private List<PathNode> path;

    public RouteResult() {}

    public RouteResult(String mode, double distanceKm, int etaMinutes, Integer detourVsFastestPercent, Integer flaggedStretchesAvoided, List<PathNode> path) {
        this.mode = mode;
        this.distanceKm = distanceKm;
        this.etaMinutes = etaMinutes;
        this.detourVsFastestPercent = detourVsFastestPercent;
        this.flaggedStretchesAvoided = flaggedStretchesAvoided;
        this.path = path;
    }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public int getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(int etaMinutes) { this.etaMinutes = etaMinutes; }
    public Integer getDetourVsFastestPercent() { return detourVsFastestPercent; }
    public void setDetourVsFastestPercent(Integer detourVsFastestPercent) { this.detourVsFastestPercent = detourVsFastestPercent; }
    public Integer getFlaggedStretchesAvoided() { return flaggedStretchesAvoided; }
    public void setFlaggedStretchesAvoided(Integer flaggedStretchesAvoided) { this.flaggedStretchesAvoided = flaggedStretchesAvoided; }
    public List<PathNode> getPath() { return path; }
    public void setPath(List<PathNode> path) { this.path = path; }

    public static class PathNode {
        private double lat;
        private double lng;
        private String nodeId;

        public PathNode() {}

        public PathNode(double lat, double lng, String nodeId) {
            this.lat = lat;
            this.lng = lng;
            this.nodeId = nodeId;
        }

        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
        public String getNodeId() { return nodeId; }
        public void setNodeId(String nodeId) { this.nodeId = nodeId; }
    }
}
