package com.civicpulse.dto;

public class AuthResponse {
    public String token;
    public Long userId;
    public String role;

    public AuthResponse(String token, Long userId, String role) {
        this.token = token;
        this.userId = userId;
        this.role = role;
    }
}
