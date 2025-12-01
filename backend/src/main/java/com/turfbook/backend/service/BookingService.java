package com.turfbook.backend.service;

import com.turfbook.backend.model.Booking;
import com.turfbook.backend.model.BookingParticipant;
import com.turfbook.backend.model.TurfSlot;
import com.turfbook.backend.model.Turf;
import com.turfbook.backend.model.enums.BookingStatus;
import com.turfbook.backend.model.enums.ParticipantStatus;
import com.turfbook.backend.repository.BookingParticipantRepository;
import com.turfbook.backend.repository.BookingRepository;
import com.turfbook.backend.repository.TurfSlotRepository;
import com.turfbook.backend.repository.TurfRepository;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for managing bookings with pessimistic locking to prevent double
 * bookings
 */
@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);
    private static final int LOCK_EXPIRY_MINUTES = 15;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TurfSlotRepository turfSlotRepository;

    @Autowired
    private TurfRepository turfRepository;

    @Autowired
    private BookingParticipantRepository bookingParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Initiate a booking with pessimistic locking on the slot
     * This prevents concurrent users from booking the same slot
     * 
     * @param userId      User ID initiating the booking
     * @param turfId      Turf ID
     * @param slotId      Slot ID to book
     * @param totalAmount Total booking amount
     * @return Created booking in PENDING status
     * @throws RuntimeException if slot is not available or already locked
     */
    @Transactional
    public Booking initiateBooking(Long userId, Long turfId, Long slotId, BigDecimal totalAmount) {
        logger.info("Initiating booking for user {} on slot {}", userId, slotId);

        // 1. Acquire pessimistic write lock on the slot (blocks other transactions)
        TurfSlot slot = turfSlotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found: " + slotId));

        // 2. Validate slot availability
        if (!slot.getIsAvailable()) {
            logger.warn("Slot {} is not available", slotId);
            throw new RuntimeException("Slot is not available");
        }

        if (slot.getIsLocked()) {
            logger.warn("Slot {} is already locked by user {}", slotId, slot.getLockedBy());
            throw new RuntimeException("Slot is currently locked by another user");
        }

        // 3. Check if slot already has a booking
        if (bookingRepository.findBySlotId(slotId).isPresent()) {
            logger.warn("Slot {} already has a booking", slotId);
            throw new RuntimeException("Slot is already booked");
        }

        // 4. Lock the slot (15-minute expiry for payment)
        LocalDateTime now = LocalDateTime.now();
        slot.setIsLocked(true);
        slot.setLockedBy(userId);
        slot.setLockedAt(now);
        slot.setLockExpiresAt(now.plusMinutes(LOCK_EXPIRY_MINUTES));
        turfSlotRepository.save(slot);

        logger.info("Locked slot {} for user {} until {}", slotId, userId, slot.getLockExpiresAt());

        // 5. Calculate amount if not provided
        BigDecimal amount = totalAmount;
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            amount = calculateSlotPrice(slot, turfId);
        }

        // 6. Create booking in PENDING status
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setTurfId(turfId);
        booking.setSlotId(slotId);
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalAmount(amount);
        booking.setExpiresAt(now.plusMinutes(LOCK_EXPIRY_MINUTES));

        Booking savedBooking = bookingRepository.save(booking);
        logger.info("Created booking {} in PENDING status, expires at {}", savedBooking.getId(),
                savedBooking.getExpiresAt());

        return savedBooking;
    }

    /**
     * Calculate slot price based on custom price or turf base price
     */
    private BigDecimal calculateSlotPrice(TurfSlot slot, Long turfId) {
        if (slot.getCustomPrice() != null && slot.getCustomPrice().compareTo(BigDecimal.ZERO) > 0) {
            return slot.getCustomPrice();
        }

        // Fallback to turf base price
        return turfRepository.findById(turfId)
                .map(Turf::getBasePrice)
                .orElse(new BigDecimal("1000")); // Default price
    }

    /**
     * Confirm booking after successful payment
     * This is called by the payment webhook
     */
    @Transactional
    public Booking confirmBooking(Long bookingId) {
        logger.info("Confirming booking {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            logger.warn("Booking {} is not in PENDING status: {}", bookingId, booking.getStatus());
            throw new RuntimeException("Booking is not in PENDING status");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());

        // Mark slot as unavailable and unlock it
        TurfSlot slot = turfSlotRepository.findById(booking.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        slot.setIsAvailable(false);
        slot.setIsLocked(false);
        slot.setLockedBy(null);
        slot.setLockedAt(null);
        slot.setLockExpiresAt(null);
        turfSlotRepository.save(slot);

        logger.info("Confirmed booking {} and marked slot {} as unavailable", bookingId, slot.getId());

        return bookingRepository.save(booking);
    }

    /**
     * Cancel a booking
     */
    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        logger.info("Cancelling booking {} by user {}", bookingId, userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // Verify user owns the booking
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("User does not own this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed booking");
        }

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        // Release the slot lock if still locked
        if (booking.getStatus() == BookingStatus.PENDING) {
            TurfSlot slot = turfSlotRepository.findById(booking.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Slot not found"));

            if (slot.getIsLocked() && slot.getLockedBy().equals(userId)) {
                slot.setIsLocked(false);
                slot.setLockedBy(null);
                slot.setLockedAt(null);
                slot.setLockExpiresAt(null);
                turfSlotRepository.save(slot);
                logger.info("Released lock on slot {}", slot.getId());
            }
        }

        return bookingRepository.save(booking);
    }

    /**
     * Get booking by ID
     */
    public Booking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId).orElse(null);
    }

    /**
     * Get all bookings for a user
     */
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    /**
     * Get booking by QR secret (for check-in)
     */
    public Booking getBookingByQrSecret(String qrSecret) {
        return bookingRepository.findByQrSecret(qrSecret).orElse(null);
    }

    /**
     * Add participant to booking (for split payment)
     */
    @Autowired
    private NotificationService notificationService;

    /**
     * Add participant to booking (for split payment)
     */
    @Transactional
    public void addParticipant(Long bookingId, Long userId) {
        logger.info("Adding participant {} to booking {}", userId, bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Cannot add participant to non-pending booking");
        }

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }

        if (booking.getUserId().equals(userId)) {
            throw new RuntimeException("Owner cannot be added as participant");
        }

        List<BookingParticipant> participants = bookingParticipantRepository.findByBookingId(bookingId);

        // If this is the first participant, add the owner as a participant too
        if (participants.isEmpty()) {
            BookingParticipant ownerParticipant = new BookingParticipant();
            ownerParticipant.setBookingId(bookingId);
            ownerParticipant.setUserId(booking.getUserId());
            ownerParticipant.setStatus(ParticipantStatus.PENDING);
            participants.add(ownerParticipant);
        }

        // Check if user is already a participant
        boolean alreadyParticipant = participants.stream().anyMatch(p -> p.getUserId().equals(userId));
        if (alreadyParticipant) {
            throw new RuntimeException("User is already a participant");
        }

        BookingParticipant newParticipant = new BookingParticipant();
        newParticipant.setBookingId(bookingId);
        newParticipant.setUserId(userId);
        newParticipant.setStatus(ParticipantStatus.PENDING);
        participants.add(newParticipant);

        // Recalculate share amount
        int totalPeople = participants.size();
        BigDecimal shareAmount = booking.getTotalAmount().divide(BigDecimal.valueOf(totalPeople), 2,
                java.math.RoundingMode.HALF_UP);

        for (BookingParticipant p : participants) {
            p.setShareAmount(shareAmount);
        }

        bookingParticipantRepository.saveAll(participants);
        logger.info("Added participant {} to booking {}. New share amount: {}", userId, bookingId, shareAmount);

        sendBookingUpdate(bookingId);

        // Notification
        notificationService.createNotification(
                userId,
                com.turfbook.backend.model.enums.NotificationType.REQUEST,
                "You have been requested to split payment for a booking",
                bookingId,
                "BOOKING",
                true);
    }

    private void sendBookingUpdate(Long bookingId) {
        Booking booking = getBooking(bookingId);
        if (booking != null) {
            messagingTemplate.convertAndSend("/topic/bookings/" + bookingId, booking);
        }
    }

    /**
     * Process payment for a booking
     */
    @Transactional
    public void processPayment(Long bookingId, Long userId, String paymentId) {
        logger.info("Processing payment for booking {} by user {}", bookingId, userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if split payment
        List<BookingParticipant> participants = bookingParticipantRepository.findByBookingId(bookingId);

        if (participants.isEmpty()) {
            // Full payment by owner
            if (!booking.getUserId().equals(userId)) {
                throw new RuntimeException("Only owner can make full payment for this booking");
            }
            confirmBooking(bookingId);
        } else {
            // Split payment
            BookingParticipant participant = participants.stream()
                    .filter(p -> p.getUserId().equals(userId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User is not a participant in this booking"));

            participant.setStatus(ParticipantStatus.PAID);
            // participant.setPaymentId(paymentId); // Assuming field exists or we add it
            bookingParticipantRepository.save(participant);

            // Notification to owner
            if (!booking.getUserId().equals(userId)) {
                notificationService.createNotification(
                        booking.getUserId(),
                        com.turfbook.backend.model.enums.NotificationType.INFO,
                        "A participant has paid their share for booking #" + bookingId,
                        bookingId,
                        "BOOKING",
                        false);
            }

            // Check if all paid
            boolean allPaid = participants.stream().allMatch(p -> p.getStatus() == ParticipantStatus.PAID);
            if (allPaid) {
                confirmBooking(bookingId);

                // Notify all participants
                participants.forEach(p -> {
                    notificationService.createNotification(
                            p.getUserId(),
                            com.turfbook.backend.model.enums.NotificationType.INFO,
                            "Booking #" + bookingId + " is fully paid and confirmed!",
                            bookingId,
                            "BOOKING",
                            false);
                });
            }
        }
    }

    @Transactional
    public void updateParticipantStatus(Long bookingId, Long userId, String status) {
        BookingParticipant participant = bookingParticipantRepository.findByBookingIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        try {
            ParticipantStatus newStatus = ParticipantStatus.valueOf(status);
            participant.setStatus(newStatus);
            bookingParticipantRepository.save(participant);

            if (newStatus == ParticipantStatus.DECLINED || newStatus == ParticipantStatus.REJECTED) {
                // Notify owner
                Booking booking = bookingRepository.findById(bookingId).orElseThrow();
                notificationService.createNotification(
                        booking.getUserId(),
                        com.turfbook.backend.model.enums.NotificationType.ALERT,
                        "A participant declined the split payment request for booking #" + bookingId,
                        bookingId,
                        "BOOKING",
                        true);
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    /**
     * Scheduled task to release expired locks and expire pending bookings
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    @Transactional
    public void releaseExpiredLocksAndBookings() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Release expired slot locks
        List<TurfSlot> expiredSlots = turfSlotRepository.findByIsLockedTrueAndLockExpiresAtBefore(now);

        if (!expiredSlots.isEmpty()) {
            logger.info("Releasing {} expired slot locks", expiredSlots.size());

            for (TurfSlot slot : expiredSlots) {
                logger.debug("Releasing lock on slot {} (locked by user {} at {})",
                        slot.getId(), slot.getLockedBy(), slot.getLockedAt());

                slot.setIsLocked(false);
                slot.setLockedBy(null);
                slot.setLockedAt(null);
                slot.setLockExpiresAt(null);
            }

            turfSlotRepository.saveAll(expiredSlots);
        }

        // 2. Expire pending bookings
        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore(
                BookingStatus.PENDING, now);

        if (!expiredBookings.isEmpty()) {
            logger.info("Expiring {} pending bookings", expiredBookings.size());

            for (Booking booking : expiredBookings) {
                logger.debug("Expiring booking {} (created at {}, expired at {})",
                        booking.getId(), booking.getCreatedAt(), booking.getExpiresAt());

                booking.setStatus(BookingStatus.EXPIRED);
            }

            bookingRepository.saveAll(expiredBookings);
        }
    }

    /**
     * Create a booking manually by the owner (Walk-in)
     */
    @Transactional
    public Booking createOwnerBooking(Long ownerId, Long turfId, Long slotId, String customerName,
            String customerPhone) {
        logger.info("Owner {} creating walk-in booking for slot {}", ownerId, slotId);

        // 1. Verify ownership
        Turf turf = turfRepository.findById(turfId)
                .orElseThrow(() -> new RuntimeException("Turf not found"));

        if (!turf.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You do not own this turf");
        }

        // 2. Acquire lock and validate slot
        TurfSlot slot = turfSlotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getIsAvailable()) {
            throw new RuntimeException("Slot is not available");
        }

        if (slot.getIsLocked()) {
            throw new RuntimeException("Slot is currently locked by an online user");
        }

        // 3. Mark slot as unavailable immediately
        slot.setIsAvailable(false);
        turfSlotRepository.save(slot);

        // 4. Create CONFIRMED booking
        Booking booking = new Booking();
        booking.setUserId(ownerId); // Walk-in (using owner ID as placeholder)
        booking.setTurfId(turfId);
        booking.setSlotId(slotId);
        booking.setCustomerName(customerName);
        booking.setCustomerPhone(customerPhone);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTotalAmount(calculateSlotPrice(slot, turfId));
        booking.setConfirmedAt(LocalDateTime.now());
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }
}
