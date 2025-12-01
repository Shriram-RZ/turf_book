package com.turfbook.backend.repository;

import com.turfbook.backend.model.Booking;
import com.turfbook.backend.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        /**
         * Find bookings by user ID
         * 
         * @param userId User ID
         * @return List of bookings
         */
        List<Booking> findByUserId(Long userId);

        /**
         * Find bookings by status and expiry time (for cleanup)
         * 
         * @param status     Booking status
         * @param expiryTime Expiry threshold
         * @return List of expired bookings
         */
        List<Booking> findByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime expiryTime);

        /**
         * Find booking by QR secret
         * 
         * @param qrSecret QR secret string
         * @return Optional booking
         */
        Optional<Booking> findByQrSecret(String qrSecret);

        /**
         * Find bookings by user and status
         * 
         * @param userId User ID
         * @param status Booking status
         * @return List of bookings
         */
        List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

        /**
         * Find bookings by slot ID
         * 
         * @param slotId Slot ID
         * @return Optional booking
         */
        Optional<Booking> findBySlotId(Long slotId);

        /**
         * Find bookings for turfs owned by a specific owner
         * 
         * @param ownerId Owner ID
         * @return List of bookings
         */
        @Query("SELECT b FROM Booking b JOIN b.turf t WHERE t.ownerId = :ownerId")
        List<Booking> findByTurfOwnerId(@Param("ownerId") Long ownerId);

        /**
         * Find bookings for turfs owned by a specific owner with eager fetching of Turf
         * This prevents lazy loading exceptions by fetching the turf in the same query
         * 
         * @param ownerId Owner ID
         * @return List of bookings with turf eagerly loaded
         */
        @Query("SELECT b FROM Booking b JOIN FETCH b.turf t WHERE t.ownerId = :ownerId")
        List<Booking> findByTurfOwnerIdWithTurf(@Param("ownerId") Long ownerId);

        /**
         * Get daily revenue for an owner within a date range
         */
        @Query("SELECT new com.turfbook.backend.dto.AnalyticsDTO$DailyRevenueDTO(FUNCTION('DATE_FORMAT', b.createdAt, '%Y-%m-%d'), COALESCE(SUM(b.totalAmount), 0)) "
                        +
                        "FROM Booking b JOIN b.turf t " +
                        "WHERE t.ownerId = :ownerId " +
                        "AND b.createdAt BETWEEN :startDate AND :endDate " +
                        "GROUP BY FUNCTION('DATE_FORMAT', b.createdAt, '%Y-%m-%d')")
        List<com.turfbook.backend.dto.AnalyticsDTO.DailyRevenueDTO> getDailyRevenue(
                        @Param("ownerId") Long ownerId,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Count total bookings for an owner
         */
        @Query("SELECT COALESCE(COUNT(b), 0) FROM Booking b JOIN b.turf t WHERE t.ownerId = :ownerId")
        Long countTotalBookingsByOwnerId(@Param("ownerId") Long ownerId);

        /**
         * Count active bookings (CONFIRMED or PENDING) for an owner
         */
        @Query("SELECT COALESCE(COUNT(b), 0) FROM Booking b JOIN b.turf t " +
                        "WHERE t.ownerId = :ownerId AND b.status IN (com.turfbook.backend.model.enums.BookingStatus.CONFIRMED, com.turfbook.backend.model.enums.BookingStatus.PENDING)")
        Integer countActiveBookingsByOwnerId(@Param("ownerId") Long ownerId);

        /**
         * Calculate total revenue for an owner
         */
        @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b JOIN b.turf t WHERE t.ownerId = :ownerId")
        BigDecimal calculateTotalRevenueByOwnerId(@Param("ownerId") Long ownerId);

        /**
         * Count unique customers (users) who have bookings for turfs owned by a
         * specific owner
         * 
         * @param ownerId Owner ID
         * @return Count of unique customers
         */
        @Query("SELECT COALESCE(COUNT(DISTINCT b.userId), 0) FROM Booking b JOIN b.turf t WHERE t.ownerId = :ownerId AND b.userId IS NOT NULL")
        Long countUniqueCustomersByOwnerId(@Param("ownerId") Long ownerId);
}
