package com.civicpulse.service;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.model.Worker;
import com.civicpulse.repository.WorkerRepository;
import com.civicpulse.repository.IssueClusterRepository;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerAssignmentService {
    private final WorkerRepository workerRepository;
    private final IssueClusterRepository clusterRepository;

    public WorkerAssignmentService(WorkerRepository workerRepository, IssueClusterRepository clusterRepository) {
        this.workerRepository = workerRepository;
        this.clusterRepository = clusterRepository;
    }

    public List<WorkerScore> rankCandidates(Long clusterId) {
        IssueCluster cluster = clusterRepository.findById(clusterId).orElseThrow();
        List<Worker> eligible = workerRepository.findByDepartment(cluster.getDepartment());
        return eligible.stream()
            .map(w -> {
                double distanceKm = com.civicpulse.service.DuplicateDetectionService.haversineMeters(
                        cluster.getCentroidLat(), cluster.getCentroidLng(), w.getCurrentLat(), w.getCurrentLng()) / 1000.0;
                double score = cluster.getPriorityScore()
                        * (1.0 / (1.0 + distanceKm))
                        * (1.0 / (1.0 + w.getActiveTaskCount()));
                return new WorkerScore(w.getId(), w.getUserId(), distanceKm, w.getActiveTaskCount(), score);
            })
            .sorted(Comparator.comparingDouble(WorkerScore::score).reversed())
            .collect(Collectors.toList());
    }

    public record WorkerScore(Long workerId, Long userId, double distanceKm, int activeTaskCount, double score) {}

    @jakarta.annotation.PostConstruct
    public void seedWorkers() {
        if (workerRepository.count() == 0) {
            Worker w1 = new Worker(); w1.setDepartment("ROAD"); w1.setCurrentLat(23.109); w1.setCurrentLng(72.534); w1.setActiveTaskCount(0);
            Worker w2 = new Worker(); w2.setDepartment("ROAD"); w2.setCurrentLat(23.150); w2.setCurrentLng(72.580); w2.setActiveTaskCount(5);
            Worker w3 = new Worker(); w3.setDepartment("SANITATION"); w3.setCurrentLat(23.109); w3.setCurrentLng(72.534); w3.setActiveTaskCount(0);
            workerRepository.saveAll(List.of(w1, w2, w3));
        }
    }
}
