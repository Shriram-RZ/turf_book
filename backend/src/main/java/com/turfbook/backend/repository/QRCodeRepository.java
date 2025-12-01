package com.turfbook.backend.repository;

import com.turfbook.backend.model.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for QRCode entity
 * Manages QR codes for booking check-ins
 */
@Repository
public interface QRCodeRepository extends JpaRepository<QRCode, Long> {

    /**
     * Find QR code by secret
     * 
     * @param qrSecret QR secret string
     * @return Optional QR code
     */
    Optional<QRCode> findByQrSecret(String qrSecret);

    /**
     * Find QR code by booking ID
     * 
     * @param bookingId Booking ID
     * @return Optional QR code
     */
    Optional<QRCode> findByBookingId(Long bookingId);

    /**
     * Check if QR code exists for booking
     * 
     * @param bookingId Booking ID
     * @return True if QR code exists
     */
    boolean existsByBookingId(Long bookingId);
}
