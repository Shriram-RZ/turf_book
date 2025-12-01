package com.turfbook.backend.dto.response;

import com.turfbook.backend.model.enums.UserRole;

/**
 * Response DTO for user information
 */
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private String avatarUrl;
    private Integer skillRating;
    private Integer matchesPlayed;
    private Integer matchesWon;
    private Integer level;
    private Integer levelProgress;
    private Boolean enabled;

    // Constructors
    public UserResponse() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Integer getSkillRating() {
        return skillRating;
    }

    public void setSkillRating(Integer skillRating) {
        this.skillRating = skillRating;
    }

    public Integer getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(Integer matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }

    public Integer getMatchesWon() {
        return matchesWon;
    }

    public void setMatchesWon(Integer matchesWon) {
        this.matchesWon = matchesWon;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getLevelProgress() {
        return levelProgress;
    }

    public void setLevelProgress(Integer levelProgress) {
        this.levelProgress = levelProgress;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    // Computed properties
    public Double getWinRate() {
        if (matchesPlayed == null || matchesPlayed == 0) {
            return 0.0;
        }
        return (matchesWon != null ? matchesWon : 0) * 100.0 / matchesPlayed;
    }
}
