package com.civicpulse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GeminiCopilotService {
    @Value("${civicpulse.gemini-api-key:}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String askCopilot(String question, String contextData) {
        if (apiKey == null || apiKey.isBlank()) {
            return "I am an AI assistant, but my API key is not configured. I can see you have some reports, but I cannot process your request fully right now.";
        }
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
            String prompt = """
                You are a civic assistant. Answer only using the provided data. If you don't know, say so.
                
                DATA:
                %s
                
                USER QUESTION:
                %s
                """.formatted(contextData, question);
                
            Map<String, Object> body = Map.of("contents",
                    new Object[]{ Map.of("parts", new Object[]{ Map.of("text", prompt) }) });
            Map response = restTemplate.postForObject(url, body, Map.class);
            return extractText(response);
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I am having trouble connecting to my brain right now.";
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
}
