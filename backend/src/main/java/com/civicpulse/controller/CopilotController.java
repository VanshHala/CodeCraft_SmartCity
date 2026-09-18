package com.civicpulse.controller;

import com.civicpulse.model.Report;
import com.civicpulse.repository.ReportRepository;
import com.civicpulse.repository.IssueClusterRepository;
import com.civicpulse.service.GeminiCopilotService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/copilot")
@PreAuthorize("hasRole('CITIZEN')")
public class CopilotController {
    private final GeminiCopilotService copilotService;
    private final ReportRepository reportRepository;
    private final IssueClusterRepository clusterRepository;

    public CopilotController(GeminiCopilotService copilotService, ReportRepository reportRepository, IssueClusterRepository clusterRepository) {
        this.copilotService = copilotService;
        this.reportRepository = reportRepository;
        this.clusterRepository = clusterRepository;
    }

    @PostMapping("/ask")
    public Map<String, String> ask(@RequestBody Map<String, String> body, Authentication auth) {
        String question = body.get("question");
        Long citizenId = Long.parseLong(auth.getName());
        
        List<Report> userReports = reportRepository.findByCitizenId(citizenId);
        long openIssues = clusterRepository.findAll().stream().filter(c -> !"RESOLVED".equals(c.getStatus())).count();
        long resolvedIssues = clusterRepository.findAll().stream().filter(c -> "RESOLVED".equals(c.getStatus())).count();

        String reportsContext = userReports.isEmpty() ? "No reports submitted by this user." :
            userReports.stream().map(r -> "- Report #" + r.getId() + ": " + r.getAiIssueType() + " (" + (r.getDescription() != null ? r.getDescription() : "No desc") + ")")
            .collect(Collectors.joining("\n"));

        String contextData = "Citizen's Reports:\n" + reportsContext + "\n\nWard Stats:\n- Open Issues: " + openIssues + "\n- Resolved Issues: " + resolvedIssues;

        String answer = copilotService.askCopilot(question, contextData);
        return Map.of("answer", answer);
    }
}
