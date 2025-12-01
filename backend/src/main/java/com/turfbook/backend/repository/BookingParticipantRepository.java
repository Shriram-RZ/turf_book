package com.turfbook.backend.repository;

import com.turfbook.backend.model.BookingParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingParticipantRepository extends JpaRepository<BookingParticipant, Long> {
    List<BookingParticipant> findByBookingId(Long bookingId);

    Optional<BookingParticipant> findByBookingIdAndUserId(Long bookingId, Long userId);
}
