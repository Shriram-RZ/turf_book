package com.turfbook.backend.service;

import com.turfbook.backend.dto.response.AchievementResponse;
import com.turfbook.backend.model.Achievement;
import com.turfbook.backend.model.UserAchievement;
import com.turfbook.backend.repository.UserAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    @Autowired
    private com.turfbook.backend.repository.UserAchievementRepository userAchievementRepository;

    @Autowired
    private com.turfbook.backend.repository.AchievementRepository achievementRepository;

    @Autowired
    private com.turfbook.backend.repository.UserRepository userRepository;

    public List<AchievementResponse> getMyAchievements(Long userId) {
        return userAchievementRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AchievementResponse> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(achievement -> {
                    AchievementResponse response = new AchievementResponse();
                    response.setId(achievement.getId());
                    response.setName(achievement.getName());
                    response.setDescription(achievement.getDescription());
                    response.setIconUrl(achievement.getIconUrl());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void checkAndUnlockAchievement(Long userId, String achievementId) {
        if (userAchievementRepository.findByUserIdAndAchievementId(userId, achievementId).isPresent()) {
            return;
        }

        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + achievementId));

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUserId(userId);
        userAchievement.setAchievement(achievement);
        userAchievement.setUnlockedAt(java.time.LocalDateTime.now());

        userAchievementRepository.save(userAchievement);
    }

    private AchievementResponse mapToResponse(UserAchievement userAchievement) {
        Achievement achievement = userAchievement.getAchievement();
        AchievementResponse response = new AchievementResponse();
        response.setId(achievement.getId());
        response.setName(achievement.getName());
        response.setDescription(achievement.getDescription());
        response.setIconUrl(achievement.getIconUrl());
        response.setUnlockedAt(userAchievement.getUnlockedAt());
        return response;
    }
}
