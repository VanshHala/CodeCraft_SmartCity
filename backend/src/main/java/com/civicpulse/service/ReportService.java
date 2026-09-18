package com.civicpulse.service;
import com.civicpulse.dto.ReportRequest;
import com.civicpulse.dto.ReportResponse;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.model.Report;
import com.civicpulse.repository.IssueClusterRepository;
import com.civicpulse.repository.ReportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final IssueClusterRepository clusterRepository;

    public ReportService(ReportRepository reportRepository, IssueClusterRepository clusterRepository) {
        this.reportRepository = reportRepository;
        this.clusterRepository = clusterRepository;
    }

    public ReportResponse submitReport(ReportRequest req) {
        IssueCluster cluster = new IssueCluster();
        cluster.setIssueType(req.issueType);
        cluster.setDepartment(getDepartment(req.issueType));
        cluster.setSeverity(5);
        cluster.setCentroidLat(req.lat);
        cluster.setCentroidLng(req.lng);
        cluster.setStatus("REPORTED");
        cluster.setReportCount(1);
        cluster.setPriorityScore(0.0);
        cluster = clusterRepository.save(cluster);

        Report report = new Report();
        report.setCitizenId(req.citizenId);
        report.setClusterId(cluster.getId());
        report.setPhotoUrl(req.photoUrl);
        report.setDescription(req.description);
        report.setLat(req.lat);
        report.setLng(req.lng);
        report = reportRepository.save(report);

        return new ReportResponse(report.getId(), cluster.getId(), cluster.getStatus(), false, 1, 0.0);
    }

    public List<Report> findByCitizen(Long citizenId) {
        return reportRepository.findByCitizenId(citizenId);
    }

    private String getDepartment(String issueType) {
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
}
