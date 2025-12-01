package com.turfbook.backend.model.enums;

/**
 * Friend status enumeration
 * Represents the state of a friend relationship
 */
public enum FriendStatus {
    /**
     * Friend request sent, awaiting acceptance
     */
    SENT,

    /**
     * Friend request received, awaiting action (for receiver)
     */
    PENDING,

    /**
     * Friend request accepted, users are friends
     */
    ACCEPTED,

    /**
     * Friend request rejected
     */
    REJECTED,

    /**
     * Friend removed
     */
    REMOVED,

    /**
     * User has blocked this friend
     */
    BLOCKED
}
