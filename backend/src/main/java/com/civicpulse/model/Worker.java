package com.civicpulse.model;
import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class Worker {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String department;
    private Double currentLat;
    private Double currentLng;
    private Integer activeTaskCount = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public Integer getActiveTaskCount() { return activeTaskCount; }
    public void setActiveTaskCount(Integer activeTaskCount) { this.activeTaskCount = activeTaskCount; }
}
