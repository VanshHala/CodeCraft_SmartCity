package com.civicpulse.repository;
import com.civicpulse.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByDepartment(String department);
}
