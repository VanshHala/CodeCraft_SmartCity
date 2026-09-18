package com.civicpulse.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resolutions")
public class Resolution {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long clusterId;
    private Long workerId;
    private String beforePhotoUrl;
    private String afterPhotoUrl;
    private String notes;
    private Double aiConfidence;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClusterId() { return clusterId; }
    public void setClusterId(Long clusterId) { this.clusterId = clusterId; }
    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
    public String getBeforePhotoUrl() { return beforePhotoUrl; }
    public void setBeforePhotoUrl(String beforePhotoUrl) { this.beforePhotoUrl = beforePhotoUrl; }
    public String getAfterPhotoUrl() { return afterPhotoUrl; }
    public void setAfterPhotoUrl(String afterPhotoUrl) { this.afterPhotoUrl = afterPhotoUrl; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
