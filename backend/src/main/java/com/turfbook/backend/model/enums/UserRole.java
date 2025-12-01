package com.turfbook.backend.model.enums;

/**
 * User role enumeration
 * Defines the three main user types in the system
 */
public enum UserRole {
    /**
     * Regular user - can book turfs, create teams, play matches
     */
    USER,

    /**
     * Turf owner - can manage turfs, slots, and scan QR codes
     */
    OWNER,

    /**
     * System administrator - full access to all features
     */
    ADMIN
}
