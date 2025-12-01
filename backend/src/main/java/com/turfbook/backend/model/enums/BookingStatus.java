package com.turfbook.backend.model.enums;

/**
 * Booking status enumeration
 * Represents the lifecycle of a booking from initiation to completion
 */
public enum BookingStatus {
    /**
     * Booking created, awaiting payment (15-minute expiry)
     */
    PENDING,

    /**
     * Payment successful, booking confirmed, QR code generated
     */
    CONFIRMED,

    /**
     * Payment deadline passed without successful payment
     */
    EXPIRED,

    /**
     * User cancelled the booking
     */
    CANCELLED,

    /**
     * User checked in via QR code scan
     */
    COMPLETED
}
