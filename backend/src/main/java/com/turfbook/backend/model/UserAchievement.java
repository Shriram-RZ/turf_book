package com.turfbook.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * UserAchievement entity
 * Tracks user progress on achievements
 */
@Data
@Entity
@Table(name = "user_achievements", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
                "achievement_id" }), indexes = {
                                @Index(name = "idx_user_achievements_user", columnList = "user_id"),
                                @Index(name = "idx_user_achievements_unlocked", columnList = "unlocked")
                })
public class UserAchievement {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "user_id", nullable = false)
        private Long userId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", insertable = false, updatable = false)
        private User user;

        @Column(name = "achievement_id", nullable = false, length = 50)
        private String achievementId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "achievement_id", insertable = false, updatable = false)
        private Achievement achievement;

        @Column(nullable = false)
        private Integer progress = 0;

        @Column(nullable = false)
        private Boolean unlocked = false;

        @Column(name = "unlocked_at")
        private LocalDateTime unlockedAt;

        @CreationTimestamp
        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;

        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public Long getUserId() {
                return userId;
        }

        public void setUserId(Long userId) {
                this.userId = userId;
        }

        public User getUser() {
                return user;
        }

        public void setUser(User user) {
                this.user = user;
        }

        public String getAchievementId() {
                return achievementId;
        }

        public void setAchievementId(String achievementId) {
                this.achievementId = achievementId;
        }

        public Achievement getAchievement() {
                return achievement;
        }

        public void setAchievement(Achievement achievement) {
                this.achievement = achievement;
        }

        public Integer getProgress() {
                return progress;
        }

        public void setProgress(Integer progress) {
                this.progress = progress;
        }

        public Boolean getUnlocked() {
                return unlocked;
        }

        public void setUnlocked(Boolean unlocked) {
                this.unlocked = unlocked;
        }

        public LocalDateTime getUnlockedAt() {
                return unlockedAt;
        }

        public void setUnlockedAt(LocalDateTime unlockedAt) {
                this.unlockedAt = unlockedAt;
        }

        public LocalDateTime getCreatedAt() {
                return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
                this.createdAt = createdAt;
        }
}
