package com.turfbook.backend.model.enums;

/**
 * Achievement category enumeration
 * Groups achievements by type
 */
public enum AchievementCategory {
    /**
     * Achievements related to playing matches
     */
    MATCHES,

    /**
     * Achievements related to winning games
     */
    WINS,

    /**
     * Team-related achievements
     */
    TEAM,

    /**
     * Social achievements (friends, invites, etc.)
     */
    SOCIAL,

    /**
     * Special/unique achievements
     */
    SPECIAL
}
