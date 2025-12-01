package com.turfbook.backend.model.enums;

/**
 * Payment status enumeration
 * Tracks the state of a payment transaction
 */
public enum PaymentStatus {
    /**
     * Payment initiated, awaiting confirmation
     */
    PENDING,

    /**
     * Payment successfully completed
     */
    SUCCESS,

    /**
     * Payment failed
     */
    FAILED,

    /**
     * Payment refunded
     */
    REFUNDED
}
