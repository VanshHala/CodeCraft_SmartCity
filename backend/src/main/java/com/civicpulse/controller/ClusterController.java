package com.civicpulse.controller;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.repository.IssueClusterRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/clusters")
public class ClusterController {
    private final IssueClusterRepository repo;
    private final com.civicpulse.service.ClusterService clusterService;
    private final com.civicpulse.service.WorkerAssignmentService workerAssignmentService;
    
    public ClusterController(IssueClusterRepository repo, com.civicpulse.service.ClusterService clusterService, com.civicpulse.service.WorkerAssignmentService workerAssignmentService) { 
        this.repo = repo; 
        this.clusterService = clusterService;
        this.workerAssignmentService = workerAssignmentService;
    }

    @GetMapping
    public List<IssueCluster> all() { return repo.findAllByOrderByPriorityScoreDesc(); }

    @GetMapping("/{id}")
    public IssueCluster one(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }

    @GetMapping("/{id}/suggest-worker")
    @PreAuthorize("hasRole('AUTHORITY')")
    public List<com.civicpulse.service.WorkerAssignmentService.WorkerScore> suggestWorker(@PathVariable Long id) {
        return workerAssignmentService.rankCandidates(id);
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasRole('AUTHORITY')")
    public IssueCluster verify(@PathVariable Long id, @RequestBody com.civicpulse.dto.VerifyRequest body) {
        return clusterService.verifyClassification(id, body.issueType, body.severity, body.department);
    }

    @PatchMapping("/{id}/priority")
    @PreAuthorize("hasRole('AUTHORITY')")
    public IssueCluster overridePriority(@PathVariable Long id, @RequestBody com.civicpulse.dto.PriorityOverrideRequest body) {
        return clusterService.overridePriority(id, body.priorityScore);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('AUTHORITY')")
    public IssueCluster assign(@PathVariable Long id, @RequestBody com.civicpulse.dto.AssignRequest body) {
        return clusterService.assignWorker(id, body.workerId);
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasRole('WORKER')")
    public IssueCluster resolve(@PathVariable Long id, @RequestBody com.civicpulse.dto.ResolveRequest body) {
        return clusterService.resolve(id, body.workerId, body.afterPhotoUrl, body.notes);
    }
}
