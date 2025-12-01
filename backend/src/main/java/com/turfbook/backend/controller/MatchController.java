package com.turfbook.backend.controller;

import com.turfbook.backend.dto.request.MatchRequest;
import com.turfbook.backend.dto.response.MatchResponse;
import com.turfbook.backend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private com.turfbook.backend.security.SecurityUtils securityUtils;

    @PostMapping("/find")
    public ResponseEntity<?> findMatch(@RequestBody MatchRequest request) {
        try {
            MatchResponse match = matchService.findMatch(request);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeMatch(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Long winnerTeamId = request.get("winnerTeamId");
            matchService.completeMatch(id, winnerTeamId);
            return ResponseEntity.ok("Match completed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMatchHistory() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            return ResponseEntity.ok(matchService.getMatchHistory(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
