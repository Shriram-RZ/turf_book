package com.turfbook.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Request DTO for initiating a booking
 */
public class InitiateBookingRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Turf ID is required")
    private Long turfId;

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    private BigDecimal totalAmount; // Optional - will be calculated if not provided

    // Constructors
    public InitiateBookingRequest() {
    }

    public InitiateBookingRequest(Long userId, Long turfId, Long slotId) {
        this.userId = userId;
        this.turfId = turfId;
        this.slotId = slotId;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTurfId() {
        return turfId;
    }

    public void setTurfId(Long turfId) {
        this.turfId = turfId;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
