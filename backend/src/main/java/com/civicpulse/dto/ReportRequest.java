package com.civicpulse.dto;
public class ReportRequest {
    public Long citizenId;
    public String photoUrl;      // returned by POST /api/uploads
    public String description;
    public String issueType;     // manually picked category for now
    public Double lat;
    public Double lng;
}
