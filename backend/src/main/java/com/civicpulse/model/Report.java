package com.civicpulse.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clusterId;
    private Long citizenId;
    private String photoUrl;
    private String description;
    private Double lat;
    private Double lng;
    private String aiIssueType;
    private Integer aiSeverity;
    private String aiDepartment;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClusterId() { return clusterId; }
    public void setClusterId(Long clusterId) { this.clusterId = clusterId; }
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public String getAiIssueType() { return aiIssueType; }
    public void setAiIssueType(String aiIssueType) { this.aiIssueType = aiIssueType; }
    public Integer getAiSeverity() { return aiSeverity; }
    public void setAiSeverity(Integer aiSeverity) { this.aiSeverity = aiSeverity; }
    public String getAiDepartment() { return aiDepartment; }
    public void setAiDepartment(String aiDepartment) { this.aiDepartment = aiDepartment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
