package com.civicpulse.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public UploadController() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @PostMapping
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String newFilename = UUID.randomUUID().toString() + ext;
        Path filePath = Paths.get(uploadDir + newFilename);
        Files.write(filePath, file.getBytes());
        return Map.of("url", "/uploads/" + newFilename);
    }
}
