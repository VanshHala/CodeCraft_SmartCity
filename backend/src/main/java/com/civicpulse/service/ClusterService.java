package com.civicpulse.service;
import com.civicpulse.model.IssueCluster;
import com.civicpulse.model.Report;
import com.civicpulse.model.Resolution;
import com.civicpulse.model.Worker;
import com.civicpulse.repository.IssueClusterRepository;
import com.civicpulse.repository.ReportRepository;
import com.civicpulse.repository.ResolutionRepository;
import com.civicpulse.repository.WorkerRepository;
import com.civicpulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClusterService {
    private final IssueClusterRepository clusterRepository;
    private final WorkerRepository workerRepository;
    private final PriorityScoringService priorityScoringService;
    private final ResolutionRepository resolutionRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final GeminiVisionService visionService;

    public ClusterService(IssueClusterRepository clusterRepository, WorkerRepository workerRepository, PriorityScoringService priorityScoringService, ResolutionRepository resolutionRepository, ReportRepository reportRepository, UserRepository userRepository, GeminiVisionService visionService) {
        this.clusterRepository = clusterRepository;
        this.workerRepository = workerRepository;
        this.priorityScoringService = priorityScoringService;
        this.resolutionRepository = resolutionRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.visionService = visionService;
    }

    public IssueCluster verifyClassification(Long id, String issueType, Integer severity, String department) {
        IssueCluster cluster = clusterRepository.findById(id).orElseThrow();
        cluster.setIssueType(issueType);
        cluster.setSeverity(severity);
        cluster.setDepartment(department);
        cluster.setPriorityScore(priorityScoringService.computePriority(cluster));
        
        if (!"VERIFIED".equals(cluster.getStatus())) {
            cluster.setStatus("VERIFIED");
            List<Report> reports = reportRepository.findByClusterId(cluster.getId());
            reports.stream().map(Report::getCitizenId).distinct().forEach(citizenId -> {
                com.civicpulse.model.User citizen = userRepository.findById(citizenId).orElse(null);
                if (citizen != null) {
                    citizen.setVerifiedReports((citizen.getVerifiedReports() == null ? 0 : citizen.getVerifiedReports()) + 1);
                    citizen.updateTrustScore();
                    citizen.setRewardPoints((citizen.getRewardPoints() == null ? 0 : citizen.getRewardPoints()) + 10);
                    userRepository.save(citizen);
                }
            });
        }
        return clusterRepository.save(cluster);
    }

    public IssueCluster overridePriority(Long id, Double priorityScore) {
        IssueCluster cluster = clusterRepository.findById(id).orElseThrow();
        cluster.setPriorityScore(priorityScore);
        return clusterRepository.save(cluster);
    }

    public IssueCluster assignWorker(Long id, Long workerId) {
        IssueCluster cluster = clusterRepository.findById(id).orElseThrow();
        Worker worker = workerRepository.findById(workerId).orElseThrow();
        
        cluster.setAssignedWorkerId(worker.getId());
        cluster.setStatus("ASSIGNED");
        clusterRepository.save(cluster);

        worker.setActiveTaskCount((worker.getActiveTaskCount() == null ? 0 : worker.getActiveTaskCount()) + 1);
        workerRepository.save(worker);

        return cluster;
    }

    public IssueCluster resolve(Long id, Long workerId, String afterPhotoUrl, String notes) {
        IssueCluster cluster = clusterRepository.findById(id).orElseThrow();
        Worker worker = workerRepository.findById(workerId).orElseThrow();

        Resolution resolution = new Resolution();
        resolution.setClusterId(cluster.getId());
        resolution.setWorkerId(worker.getId());
        resolution.setAfterPhotoUrl(afterPhotoUrl);
        resolution.setNotes(notes);

        List<Report> reports = reportRepository.findByClusterId(cluster.getId());
        if (!reports.isEmpty()) {
            // Find a report that has a photo
            reports.stream()
                   .filter(r -> r.getPhotoUrl() != null && !r.getPhotoUrl().isEmpty())
                   .findFirst()
                   .ifPresent(r -> resolution.setBeforePhotoUrl(r.getPhotoUrl()));
        }

        if (resolution.getBeforePhotoUrl() != null && resolution.getAfterPhotoUrl() != null) {
            try {
                GeminiVisionService.VisionResult res = visionService.verifyResolution(
                    resolution.getBeforePhotoUrl(), 
                    resolution.getAfterPhotoUrl(), 
                    cluster.getIssueType()
                );
                resolution.setAiConfidence(res.confidence());
            } catch (Exception e) {
                resolution.setAiConfidence(0.5);
            }
        }

        resolutionRepository.save(resolution);

        cluster.setStatus("RESOLVED");
        cluster.setResolvedAt(LocalDateTime.now());
        clusterRepository.save(cluster);

        reports.stream().map(Report::getCitizenId).distinct().forEach(citizenId -> {
            com.civicpulse.model.User citizen = userRepository.findById(citizenId).orElse(null);
            if (citizen != null) {
                citizen.setRewardPoints((citizen.getRewardPoints() == null ? 0 : citizen.getRewardPoints()) + 15);
                userRepository.save(citizen);
            }
        });

        if (worker.getActiveTaskCount() != null && worker.getActiveTaskCount() > 0) {
            worker.setActiveTaskCount(worker.getActiveTaskCount() - 1);
        } else {
            worker.setActiveTaskCount(0);
        }
        workerRepository.save(worker);

        return cluster;
    }
}
