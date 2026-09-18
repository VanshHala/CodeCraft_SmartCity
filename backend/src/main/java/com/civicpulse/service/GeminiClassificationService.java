package com.civicpulse.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class GeminiClassificationService {
    @Value("${civicpulse.gemini-api-key:}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public Classification classify(String photoUrl, String description) {
        if (apiKey == null || apiKey.isBlank()) {
            return keywordFallback(description);
        }
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            String prompt = """
                Classify this civic issue report. Respond ONLY with JSON in this exact shape:
                {"issueType": "POTHOLE|STREETLIGHT|WATER|GARBAGE|SAFETY|OTHER",
                 "severity": <integer 1-10>, "department": "ROAD|ELECTRICAL|WATER|SANITATION|SAFETY"}
                Description: %s
                Photo URL: %s
                """.formatted(description == null ? "(none provided)" : description, photoUrl);
            Map<String, Object> body = Map.of("contents",
                    new Object[]{ Map.of("parts", new Object[]{ Map.of("text", prompt) }) });
            Map response = restTemplate.postForObject(url, body, Map.class);
            String text = extractText(response);
            return parseJson(text);
        } catch (Exception e) {
            return keywordFallback(description);
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

    private Classification parseJson(String text) {
        try {
            String cleanText = text.replaceAll("(?s)```json(.*?)```", "$1").replaceAll("(?s)```(.*?)```", "$1").trim();
            return mapper.readValue(cleanText, Classification.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON from Gemini response", e);
        }
    }

    private Classification keywordFallback(String description) {
        String d = description == null ? "" : description.toLowerCase();
        if (d.contains("pothole") || d.contains("road")) return new Classification("POTHOLE", 7, "ROAD");
        if (d.contains("light")) return new Classification("STREETLIGHT", 5, "ELECTRICAL");
        if (d.contains("water") || d.contains("leak")) return new Classification("WATER", 6, "WATER");
        if (d.contains("garbage") || d.contains("trash")) return new Classification("GARBAGE", 4, "SANITATION");
        return new Classification("OTHER", 3, "SAFETY");
    }

    public record Classification(String issueType, int severity, String department) {}
}
