package com.turfbook.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * QRCode entity
 * Stores QR code data for booking check-ins
 */
@Data
@Entity
@Table(name = "qr_codes", indexes = {
        @Index(name = "idx_qr_codes_secret", columnList = "qr_secret", unique = true),
        @Index(name = "idx_qr_codes_booking", columnList = "booking_id", unique = true)
})
public class QRCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false, unique = true)
    private Long bookingId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", insertable = false, updatable = false)
    private Booking booking;

    @Column(name = "qr_secret", nullable = false, unique = true, length = 100)
    private String qrSecret; // UUID or secure random string

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData; // Base64 encoded QR code image

    @CreationTimestamp
    @Column(name = "generated_at", nullable = false, updatable = false)
    private LocalDateTime generatedAt;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;

    @Column(name = "scanned_by")
    private Long scannedBy; // Owner user ID who scanned
}
