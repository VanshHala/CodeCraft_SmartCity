package com.civicpulse.service;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.graph.RoadGraphService;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;

@Service
public class PriorityScoringService {
    private final RoadGraphService roadGraphService;

    public PriorityScoringService(RoadGraphService roadGraphService) {
        this.roadGraphService = roadGraphService;
    }

    public double computePriority(IssueCluster cluster) {
        double severityWeight = cluster.getSeverity();
        double clusterSize = cluster.getReportCount();
        long daysOpen = ChronoUnit.DAYS.between(
                cluster.getFirstReportedAt().toLocalDate(), java.time.LocalDate.now());
        double recencyDecay = Math.max(0.3, 1.0 - daysOpen / 14.0);
        double criticalityMultiplier = roadGraphService.criticalityMultiplierFor(cluster.getCentroidLat(), cluster.getCentroidLng());
        return severityWeight * clusterSize * recencyDecay * criticalityMultiplier;
    }
}
