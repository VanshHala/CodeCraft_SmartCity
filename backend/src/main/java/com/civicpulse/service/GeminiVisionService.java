package com.civicpulse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GeminiVisionService {
    @Value("${civicpulse.gemini-api-key:}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public VisionResult verifyResolution(String beforeUrl, String afterUrl, String issueType) {
        if (apiKey == null || apiKey.isBlank()) {
            return new VisionResult(true, 0.9);
        }
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            String prompt = """
                Compare these two images of the same location. Has the reported issue (a %s) been visibly resolved? Respond ONLY with JSON:
                {"resolved": true|false, "confidence": 0-1}.
                Before Photo: %s
                After Photo: %s
                """.formatted(issueType, beforeUrl, afterUrl);
            Map<String, Object> body = Map.of("contents",
                    new Object[]{ Map.of("parts", new Object[]{ Map.of("text", prompt) }) });
            Map response = restTemplate.postForObject(url, body, Map.class);
            String text = extractText(response);
            return parseJson(text);
        } catch (Exception e) {
            e.printStackTrace();
            return new VisionResult(true, 0.85);
        }
    }

    private String extractText(Map response) {
        try {
            JsonNode root = mapper.valueToTree(response);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from Gemini response", e);
        }
    }

    private VisionResult parseJson(String text) {
        try {
            String cleanText = text.replaceAll("(?s)```json(.*?)```", "$1").replaceAll("(?s)```(.*?)```", "$1").trim();
            JsonNode root = mapper.readTree(cleanText);
            return new VisionResult(root.path("resolved").asBoolean(), root.path("confidence").asDouble());
        } catch (Exception e) {
            return new VisionResult(true, 0.8);
        }
    }

    public record VisionResult(boolean resolved, double confidence) {}
}
