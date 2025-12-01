package com.turfbook.backend.model.enums;

/**
 * Notification type enumeration
 * Categorizes different types of notifications
 */
public enum NotificationType {
    /**
     * Informational notification
     */
    INFO,

    /**
     * Alert notification requiring attention
     */
    ALERT,

    /**
     * Request notification (e.g., friend request, team invite)
     */
    REQUEST,

    /**
     * Approval notification (request accepted)
     */
    APPROVAL,

    /**
     * Match challenge notification
     */
    MATCH_CHALLENGE
}
