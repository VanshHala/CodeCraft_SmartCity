package com.civicpulse.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String passwordHash;
    private String role;
    private Double trustScore = 1.0;
    private Integer rewardPoints = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Double getTrustScore() { return trustScore; }
    public void setTrustScore(Double trustScore) { this.trustScore = trustScore; }
    public Integer getRewardPoints() { return rewardPoints; }
    public void setRewardPoints(Integer rewardPoints) { this.rewardPoints = rewardPoints; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    private Integer totalReports = 0;
    private Integer verifiedReports = 0;

    public Integer getTotalReports() { return totalReports; }
    public void setTotalReports(Integer totalReports) { this.totalReports = totalReports; }
    public Integer getVerifiedReports() { return verifiedReports; }
    public void setVerifiedReports(Integer verifiedReports) { this.verifiedReports = verifiedReports; }

    public void updateTrustScore() {
        if (totalReports == null || totalReports == 0) {
            this.trustScore = 1.0;
        } else {
            this.trustScore = (double) (verifiedReports == null ? 0 : verifiedReports) / totalReports;
        }
    }
}
