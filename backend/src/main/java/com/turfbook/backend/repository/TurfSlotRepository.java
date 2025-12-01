package com.turfbook.backend.repository;

import com.turfbook.backend.model.TurfSlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TurfSlotRepository extends JpaRepository<TurfSlot, Long> {

        /**
         * Find slots by turf ID and date
         * 
         * @param turfId Turf ID
         * @param date   Slot date
         * @return List of slots
         */
        List<TurfSlot> findByTurfIdAndDate(Long turfId, LocalDate date);

        /**
         * Find all slots for a turf
         * 
         * @param turfId Turf ID
         * @return List of slots
         */
        List<TurfSlot> findByTurfId(Long turfId);

        /**
         * Find slot by ID with pessimistic write lock (prevents concurrent booking)
         * 
         * @param id Slot ID
         * @return Optional slot with lock
         */
        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT s FROM TurfSlot s WHERE s.id = :id")
        Optional<TurfSlot> findByIdWithLock(@Param("id") Long id);

        /**
         * Find locked slots with expired lock time (for cleanup)
         * 
         * @param expiryTime Expiry threshold
         * @return List of slots with expired locks
         */
        List<TurfSlot> findByIsLockedTrueAndLockExpiresAtBefore(LocalDateTime expiryTime);

        /**
         * Find slots by multiple turf IDs and date range (for batch occupancy
         * calculation)
         * 
         * @param turfIds   List of turf IDs
         * @param startDate Start date (inclusive)
         * @param endDate   End date (inclusive)
         * @return List of slots
         */
        @Query("SELECT s FROM TurfSlot s WHERE s.turfId IN :turfIds AND s.date BETWEEN :startDate AND :endDate")
        List<TurfSlot> findByTurfIdInAndDateBetween(
                        @Param("turfIds") List<Long> turfIds,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        /**
         * Count total and booked slots for a turf on a specific date
         * Returns array: [totalSlots, bookedSlots]
         * 
         * @param turfId Turf ID
         * @param date   Slot date
         * @return Array with [total count, booked count]
         */
        /**
         * Get daily occupancy stats for an owner within a date range
         * Returns list of Object[]: [date, totalSlots, bookedSlots]
         */
        @Query("SELECT s.date, COUNT(s), SUM(CASE WHEN s.isAvailable = false THEN 1 ELSE 0 END) " +
                        "FROM TurfSlot s JOIN Turf t ON s.turfId = t.id " +
                        "WHERE t.ownerId = :ownerId " +
                        "AND s.date BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.date")
        List<Object[]> getDailyOccupancyStats(
                        @Param("ownerId") Long ownerId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}
