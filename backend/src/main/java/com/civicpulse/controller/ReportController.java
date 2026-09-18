package com.civicpulse.controller;
import com.civicpulse.dto.ReportRequest;
import com.civicpulse.dto.ReportResponse;
import com.civicpulse.service.ReportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('CITIZEN')")
public class ReportController {
    private final ReportService reportService;
    public ReportController(ReportService reportService) { this.reportService = reportService; }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> submitReport(@RequestBody ReportRequest request) {
        if (request.lat == null || request.lng == null) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", "Location (lat, lng) is required."));
        }
        if (request.photoUrl == null || request.photoUrl.isBlank()) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", "Photo is required."));
        }
        return org.springframework.http.ResponseEntity.ok(reportService.submitReport(request));
    }

    @GetMapping("/mine")
    public Object myReports(@RequestParam Long citizenId) {
        return reportService.findByCitizen(citizenId);
    }
}
