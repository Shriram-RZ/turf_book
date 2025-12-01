package com.turfbook.backend.service;

import com.turfbook.backend.dto.response.AchievementResponse;
import com.turfbook.backend.model.Achievement;
import com.turfbook.backend.model.UserAchievement;
import com.turfbook.backend.model.enums.AchievementCategory;
import com.turfbook.backend.repository.AchievementRepository;
import com.turfbook.backend.repository.UserAchievementRepository;
import com.turfbook.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AchievementServiceTest {

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private UserAchievementRepository userAchievementRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AchievementService achievementService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllAchievements_ShouldReturnListOfAchievementResponses() {
        Achievement achievement1 = new Achievement();
        achievement1.setId("FIRST_GOAL");
        achievement1.setName("First Goal");
        achievement1.setDescription("Score your first goal");
        achievement1.setCategory(AchievementCategory.MATCHES);

        Achievement achievement2 = new Achievement();
        achievement2.setId("TEAM_PLAYER");
        achievement2.setName("Team Player");
        achievement2.setDescription("Join a team");
        achievement2.setCategory(AchievementCategory.SOCIAL);

        when(achievementRepository.findAll()).thenReturn(Arrays.asList(achievement1, achievement2));

        List<AchievementResponse> responses = achievementService.getAllAchievements();

        assertEquals(2, responses.size());
        assertEquals("First Goal", responses.get(0).getName());
        assertEquals("Team Player", responses.get(1).getName());
        verify(achievementRepository, times(1)).findAll();
    }

    @Test
    void getMyAchievements_ShouldReturnListOfAchievementResponses() {
        Long userId = 1L;

        Achievement achievement = new Achievement();
        achievement.setId("FIRST_GOAL");
        achievement.setName("First Goal");

        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setId(1L);
        userAchievement.setUserId(userId);
        userAchievement.setAchievement(achievement);
        userAchievement.setUnlockedAt(LocalDateTime.now());

        when(userAchievementRepository.findByUserId(userId)).thenReturn(Arrays.asList(userAchievement));

        List<AchievementResponse> result = achievementService.getMyAchievements(userId);

        assertEquals(1, result.size());
        assertEquals("First Goal", result.get(0).getName());
        verify(userAchievementRepository, times(1)).findByUserId(userId);
    }

    @Test
    void checkAndUnlockAchievement_ShouldUnlockAchievement_WhenNotAlreadyUnlocked() {
        Long userId = 1L;
        String achievementId = "FIRST_GOAL";

        Achievement achievement = new Achievement();
        achievement.setId(achievementId);

        when(achievementRepository.findById(achievementId)).thenReturn(Optional.of(achievement));
        when(userAchievementRepository.findByUserIdAndAchievementId(userId, achievementId))
                .thenReturn(Optional.empty());

        achievementService.checkAndUnlockAchievement(userId, achievementId);

        verify(userAchievementRepository, times(1)).save(any(UserAchievement.class));
    }

    @Test
    void checkAndUnlockAchievement_ShouldNotUnlock_WhenAlreadyUnlocked() {
        Long userId = 1L;
        String achievementId = "FIRST_GOAL";

        Achievement achievement = new Achievement();
        achievement.setId(achievementId);

        UserAchievement existing = new UserAchievement();
        existing.setUserId(userId);
        existing.setAchievement(achievement);

        when(achievementRepository.findById(achievementId)).thenReturn(Optional.of(achievement));
        when(userAchievementRepository.findByUserIdAndAchievementId(userId, achievementId))
                .thenReturn(Optional.of(existing));

        achievementService.checkAndUnlockAchievement(userId, achievementId);

        verify(userAchievementRepository, never()).save(any(UserAchievement.class));
    }
}
