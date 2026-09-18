package com.civicpulse.controller;
import com.civicpulse.dto.ReportRequest;
import com.civicpulse.dto.ReportResponse;
import com.civicpulse.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;
    public ReportController(ReportService reportService) { this.reportService = reportService; }

    @PostMapping
    public ReportResponse submitReport(@RequestBody ReportRequest request) {
        return reportService.submitReport(request);
    }

    @GetMapping("/mine")
    public Object myReports(@RequestParam Long citizenId) {
        return reportService.findByCitizen(citizenId);
    }
}
