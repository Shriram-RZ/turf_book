package com.turfbook.backend.repository;

import com.turfbook.backend.model.Achievement;
import com.turfbook.backend.model.Achievement;
import com.turfbook.backend.model.enums.AchievementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Achievement entity
 * Provides CRUD operations and custom queries for achievements
 */
@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {

    /**
     * Find achievements by category
     * 
     * @param category Achievement category
     * @return List of achievements in the category
     */
    List<Achievement> findByCategory(AchievementCategory category);

    /**
     * Find achievements by category, ordered by max progress
     * 
     * @param category Achievement category
     * @return List of achievements ordered by difficulty
     */
    List<Achievement> findByCategoryOrderByMaxProgressAsc(AchievementCategory category);
}
