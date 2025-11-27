package com.example.FaceShield_Back.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🚀 FaceShield API está online e funcionando!");
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "FaceShield Backend");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
                "health", "/health",
                "api_health", "/api/health",
                "api_status", "/api/status"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "online");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "FaceShield Backend");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> simpleHealth() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/api/status")
    public ResponseEntity<Map<String, String>> status() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "API is running successfully");
        return ResponseEntity.ok(status);
    }
}
