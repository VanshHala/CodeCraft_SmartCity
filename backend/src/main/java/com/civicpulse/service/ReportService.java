package com.civicpulse.service;
import com.civicpulse.dto.ReportRequest;
import com.civicpulse.dto.ReportResponse;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.model.Report;
import com.civicpulse.repository.IssueClusterRepository;
import com.civicpulse.repository.ReportRepository;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.model.User;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final IssueClusterRepository clusterRepository;
    private final DuplicateDetectionService duplicateDetectionService;
    private final PriorityScoringService priorityScoringService;
    private final GeminiClassificationService geminiClassificationService;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, IssueClusterRepository clusterRepository,
                         DuplicateDetectionService duplicateDetectionService, PriorityScoringService priorityScoringService,
                         GeminiClassificationService geminiClassificationService, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.clusterRepository = clusterRepository;
        this.duplicateDetectionService = duplicateDetectionService;
        this.priorityScoringService = priorityScoringService;
        this.geminiClassificationService = geminiClassificationService;
        this.userRepository = userRepository;
    }

    public ReportResponse submitReport(ReportRequest req) {
        Report report = new Report();
        report.setCitizenId(req.citizenId);
        report.setPhotoUrl(req.photoUrl);
        report.setDescription(req.description);
        report.setLat(req.lat);
        report.setLng(req.lng);
        GeminiClassificationService.Classification aiClass = geminiClassificationService.classify(req.photoUrl, req.description);
        
        report.setAiIssueType(aiClass.issueType());
        report.setAiSeverity(aiClass.severity());
        report.setAiDepartment(aiClass.department());

        String finalIssueType = (req.issueType != null && !req.issueType.isBlank() && !req.issueType.equals("null")) ? req.issueType : aiClass.issueType();
        String finalDepartment = aiClass.department();
        int finalSeverity = aiClass.severity();

        User citizen = userRepository.findById(req.citizenId).orElseThrow();
        double userWeight = citizen.getTrustScore() != null ? citizen.getTrustScore() : 1.0;

        IssueCluster cluster = duplicateDetectionService.findMatchingCluster(finalIssueType, req.lat, req.lng);
        boolean merged = cluster != null;
        if (!merged) {
            cluster = new IssueCluster();
            cluster.setIssueType(finalIssueType);
            cluster.setDepartment(finalDepartment);
            cluster.setSeverity(finalSeverity);
            cluster.setCentroidLat(req.lat);
            cluster.setCentroidLng(req.lng);
            cluster.setReportCount(userWeight);
        } else {
            double prevCount = cluster.getReportCount();
            double newCount = prevCount + userWeight;
            cluster.setReportCount(newCount);
            cluster.setLastReportedAt(LocalDateTime.now());
            // running-average centroid so the pin stays near the true cluster center
            cluster.setCentroidLat((cluster.getCentroidLat() * prevCount + req.lat * userWeight) / newCount);
            cluster.setCentroidLng((cluster.getCentroidLng() * prevCount + req.lng * userWeight) / newCount);
        }
        cluster = clusterRepository.save(cluster);
        report.setClusterId(cluster.getId());
        report = reportRepository.save(report);

        citizen.setTotalReports((citizen.getTotalReports() == null ? 0 : citizen.getTotalReports()) + 1);
        citizen.updateTrustScore();
        userRepository.save(citizen);

        // STEP 9 wires real scoring in here — for now this can call a stub returning 0.0
        double priority = priorityScoringService.computePriority(cluster);
        cluster.setPriorityScore(priority);
        clusterRepository.save(cluster);

        return new ReportResponse(report.getId(), cluster.getId(), cluster.getStatus(), merged, cluster.getReportCount(), priority);
    }

    public List<Report> findByCitizen(Long citizenId) {
        return reportRepository.findByCitizenId(citizenId);
    }

    private String departmentFor(String issueType) {
        if (issueType == null) return "OTHER";
        switch (issueType.toUpperCase()) {
            case "POTHOLE": return "ROAD";
            case "STREETLIGHT": return "ELECTRICAL";
            case "WATER": return "WATER";
            case "GARBAGE": return "SANITATION";
            case "SAFETY": return "SAFETY";
            default: return "SAFETY";
        }
    }

    private Integer defaultSeverityFor(String issueType) {
        return 5;
    }
}
