package com.turfbook.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "booking_participants", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "booking_id", "user_id" })
})
public class BookingParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "share_amount", nullable = false)
    private BigDecimal shareAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.turfbook.backend.model.enums.ParticipantStatus status;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public com.turfbook.backend.model.enums.ParticipantStatus getStatus() {
        return status;
    }

    public void setStatus(com.turfbook.backend.model.enums.ParticipantStatus status) {
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = com.turfbook.backend.model.enums.ParticipantStatus.SENT;
        }
    }
}
