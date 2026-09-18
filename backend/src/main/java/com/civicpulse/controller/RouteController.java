package com.civicpulse.controller;
import com.civicpulse.graph.RoadGraphService;
import com.civicpulse.graph.RouteResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/route")
public class RouteController {
    private final RoadGraphService graphService;
    public RouteController(RoadGraphService graphService) { this.graphService = graphService; }

    @GetMapping
    public RouteResult route(@RequestParam double fromLat, @RequestParam double fromLng,
            @RequestParam double toLat, @RequestParam double toLng,
            @RequestParam(defaultValue = "fastest") String mode) {
        return graphService.findRoute(fromLat, fromLng, toLat, toLng, mode);
    }
}
