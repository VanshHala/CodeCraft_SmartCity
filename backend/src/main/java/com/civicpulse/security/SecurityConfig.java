package com.civicpulse.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable()) // Or configure proper CORS for your UI
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/route").permitAll()
                .requestMatchers("/api/uploads/**").permitAll()
                
                // WORKER endpoints
                .requestMatchers("/api/workers/**").hasRole("WORKER")
                .requestMatchers(HttpMethod.PATCH, "/api/clusters/*/resolve").hasRole("WORKER")
                
                // CITIZEN endpoints
                .requestMatchers(HttpMethod.POST, "/api/reports").hasRole("CITIZEN")
                .requestMatchers(HttpMethod.GET, "/api/reports/mine").hasRole("CITIZEN")
                
                // AUTHORITY endpoints
                .requestMatchers(HttpMethod.PATCH, "/api/clusters/**").hasRole("AUTHORITY")
                .requestMatchers(HttpMethod.GET, "/api/clusters/*/suggest-worker").hasRole("AUTHORITY")
                
                // Fallback for everything else
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
