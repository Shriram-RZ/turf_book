package com.turfbook.backend.controller;

import com.turfbook.backend.dto.response.AchievementResponse;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.turfbook.backend.security.SecurityUtils securityUtils;

    @GetMapping("/my")
    public ResponseEntity<List<AchievementResponse>> getMyAchievements() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            return ResponseEntity.ok(achievementService.getMyAchievements(userId));
        } catch (Exception e) {
            // Log error and return empty list
            return ResponseEntity.ok(List.of());
        }
    }
}
