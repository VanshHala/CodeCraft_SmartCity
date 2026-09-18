package com.civicpulse.controller;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.repository.IssueClusterRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clusters")
public class ClusterController {
    private final IssueClusterRepository repo;
    public ClusterController(IssueClusterRepository repo) { this.repo = repo; }

    @GetMapping
    public List<IssueCluster> all() { return repo.findAllByOrderByPriorityScoreDesc(); }

    @GetMapping("/{id}")
    public IssueCluster one(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }
}
