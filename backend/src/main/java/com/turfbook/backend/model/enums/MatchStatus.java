package com.turfbook.backend.model.enums;

/**
 * Match status enumeration
 * Tracks the state of a match
 */
public enum MatchStatus {
    /**
     * Match scheduled but not yet completed
     */
    PENDING,

    /**
     * Match completed with results recorded
     */
    COMPLETED,

    /**
     * Match was cancelled
     */
    CANCELLED
}
