package com.turfbook.backend.model;

import com.turfbook.backend.model.enums.AchievementCategory;
import jakarta.persistence.*;

/**
 * Achievement entity
 * Defines available achievements in the system
 */
@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @Column(length = 50)
    private String id; // e.g., "FIRST_WIN", "TEAM_PLAYER"

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url")
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AchievementCategory category;

    @Column(name = "max_progress", nullable = false)
    private Integer maxProgress; // Target value to unlock

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public AchievementCategory getCategory() {
        return category;
    }

    public void setCategory(AchievementCategory category) {
        this.category = category;
    }

    public Integer getMaxProgress() {
        return maxProgress;
    }

    public void setMaxProgress(Integer maxProgress) {
        this.maxProgress = maxProgress;
    }
}
