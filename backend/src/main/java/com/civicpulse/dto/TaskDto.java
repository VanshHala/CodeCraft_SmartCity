package com.civicpulse.dto;

public class TaskDto {
    public Long id;
    public String issueType;
    public Double priorityScore;
    public Double lat;
    public Double lng;
    public Double distanceKm;

    public TaskDto(Long id, String issueType, Double priorityScore, Double lat, Double lng, Double distanceKm) {
        this.id = id;
        this.issueType = issueType;
        this.priorityScore = priorityScore;
        this.lat = lat;
        this.lng = lng;
        this.distanceKm = distanceKm;
    }
}
