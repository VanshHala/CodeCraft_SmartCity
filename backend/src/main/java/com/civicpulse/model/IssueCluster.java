package com.civicpulse.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_clusters")
public class IssueCluster {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String issueType;
    private String department;
    private Integer severity;
    private Double centroidLat;
    private Double centroidLng;
    private String nearestEdgeId;
    private String status = "REPORTED";
    private Double priorityScore = 0.0;
    private Double reportCount = 1.0;
    private Long assignedWorkerId;
    private LocalDateTime firstReportedAt = LocalDateTime.now();
    private LocalDateTime lastReportedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }
    public Double getCentroidLat() { return centroidLat; }
    public void setCentroidLat(Double centroidLat) { this.centroidLat = centroidLat; }
    public Double getCentroidLng() { return centroidLng; }
    public void setCentroidLng(Double centroidLng) { this.centroidLng = centroidLng; }
    public String getNearestEdgeId() { return nearestEdgeId; }
    public void setNearestEdgeId(String nearestEdgeId) { this.nearestEdgeId = nearestEdgeId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }
    public Double getReportCount() { return reportCount; }
    public void setReportCount(Double reportCount) { this.reportCount = reportCount; }
    public Long getAssignedWorkerId() { return assignedWorkerId; }
    public void setAssignedWorkerId(Long assignedWorkerId) { this.assignedWorkerId = assignedWorkerId; }
    public LocalDateTime getFirstReportedAt() { return firstReportedAt; }
    public void setFirstReportedAt(LocalDateTime firstReportedAt) { this.firstReportedAt = firstReportedAt; }
    public LocalDateTime getLastReportedAt() { return lastReportedAt; }
    public void setLastReportedAt(LocalDateTime lastReportedAt) { this.lastReportedAt = lastReportedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
