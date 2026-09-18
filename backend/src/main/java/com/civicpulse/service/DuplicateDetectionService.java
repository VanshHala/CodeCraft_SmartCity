package com.civicpulse.service;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.repository.IssueClusterRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DuplicateDetectionService {
    private static final double DEDUPE_RADIUS_METERS = 50.0;
    private static final long DEDUPE_TIME_WINDOW_DAYS = 3;
    private static final double EARTH_RADIUS_METERS = 6_371_000;
    private final IssueClusterRepository clusterRepository;

    public DuplicateDetectionService(IssueClusterRepository clusterRepository) {
        this.clusterRepository = clusterRepository;
    }

    public IssueCluster findMatchingCluster(String issueType, double lat, double lng) {
        List<IssueCluster> candidates = clusterRepository.findByIssueTypeAndStatusNot(issueType, "RESOLVED");
        for (IssueCluster c : candidates) {
            boolean withinTime = ChronoUnit.DAYS.between(c.getLastReportedAt(), LocalDateTime.now()) <= DEDUPE_TIME_WINDOW_DAYS;
            boolean withinRadius = haversineMeters(lat, lng, c.getCentroidLat(), c.getCentroidLng()) <= DEDUPE_RADIUS_METERS;
            if (withinTime && withinRadius) return c;
        }
        return null;
    }

    public static double haversineMeters(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }
}
