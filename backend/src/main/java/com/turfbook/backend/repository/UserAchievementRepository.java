package com.turfbook.backend.repository;

import com.turfbook.backend.model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for UserAchievement entity
 * Tracks user progress on achievements
 */
@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    /**
     * Find all achievements for a user
     * 
     * @param userId User ID
     * @return List of user achievements
     */
    List<UserAchievement> findByUserId(Long userId);

    /**
     * Find unlocked achievements for a user
     * 
     * @param userId User ID
     * @return List of unlocked achievements
     */
    List<UserAchievement> findByUserIdAndUnlockedTrue(Long userId);

    /**
     * Find in-progress achievements for a user
     * 
     * @param userId User ID
     * @return List of in-progress achievements
     */
    List<UserAchievement> findByUserIdAndUnlockedFalse(Long userId);

    /**
     * Find a specific user achievement
     * 
     * @param userId        User ID
     * @param achievementId Achievement ID
     * @return Optional user achievement
     */
    Optional<UserAchievement> findByUserIdAndAchievementId(Long userId, String achievementId);

    /**
     * Count unlocked achievements for a user
     * 
     * @param userId User ID
     * @return Count of unlocked achievements
     */
    Long countByUserIdAndUnlockedTrue(Long userId);
}
