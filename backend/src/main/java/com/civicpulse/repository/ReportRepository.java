package com.civicpulse.repository;
import com.civicpulse.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCitizenId(Long citizenId);
    List<Report> findByClusterId(Long clusterId);
}
