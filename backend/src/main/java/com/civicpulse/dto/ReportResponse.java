package com.civicpulse.dto;
public class ReportResponse {
    public Long reportId;
    public Long clusterId;
    public String clusterStatus;
    public boolean mergedIntoExistingCluster;
    public Double clusterReportCount;
    public Double priorityScore;
    public ReportResponse(Long reportId, Long clusterId, String clusterStatus,
            boolean mergedIntoExistingCluster, Double clusterReportCount, Double priorityScore) {
        this.reportId = reportId; this.clusterId = clusterId; this.clusterStatus = clusterStatus;
        this.mergedIntoExistingCluster = mergedIntoExistingCluster;
        this.clusterReportCount = clusterReportCount; this.priorityScore = priorityScore;
    }
}
