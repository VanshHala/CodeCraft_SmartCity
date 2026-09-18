package com.civicpulse.controller;
import com.civicpulse.model.Worker;
import com.civicpulse.repository.WorkerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/workers")
@PreAuthorize("hasRole('WORKER')")
public class WorkerController {
    private final WorkerRepository repo;
    private final com.civicpulse.repository.IssueClusterRepository clusterRepo;

    public WorkerController(WorkerRepository repo, com.civicpulse.repository.IssueClusterRepository clusterRepo) { 
        this.repo = repo; 
        this.clusterRepo = clusterRepo;
    }

    @GetMapping
    public List<Worker> all() { return repo.findAll(); }

    @GetMapping("/{id}/tasks")
    public List<com.civicpulse.dto.TaskDto> tasks(@PathVariable Long id) {
        Worker worker = repo.findById(id).orElseThrow();
        return clusterRepo.findByAssignedWorkerIdAndStatus(id, "ASSIGNED").stream()
            .map(c -> {
                double dist = com.civicpulse.service.DuplicateDetectionService.haversineMeters(
                    c.getCentroidLat(), c.getCentroidLng(), worker.getCurrentLat(), worker.getCurrentLng()
                ) / 1000.0;
                return new com.civicpulse.dto.TaskDto(c.getId(), c.getIssueType(), c.getPriorityScore(), c.getCentroidLat(), c.getCentroidLng(), dist);
            })
            .sorted(java.util.Comparator.<com.civicpulse.dto.TaskDto>comparingDouble(t -> t.priorityScore).reversed()
                .thenComparingDouble(t -> t.distanceKm))
            .collect(java.util.stream.Collectors.toList());
    }
}
