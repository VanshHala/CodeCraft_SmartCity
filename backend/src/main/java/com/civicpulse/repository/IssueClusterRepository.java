package com.civicpulse.repository;
import com.civicpulse.model.IssueCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueClusterRepository extends JpaRepository<IssueCluster, Long> {
    List<IssueCluster> findByIssueTypeAndStatusNot(String issueType, String status);
    List<IssueCluster> findAllByOrderByPriorityScoreDesc();
}
