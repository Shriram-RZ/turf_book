package com.turfbook.backend.controller;

import com.turfbook.backend.model.Booking;
import com.turfbook.backend.repository.BookingRepository;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateBooking(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        Long turfId = ((Number) request.get("turfId")).longValue();
        Long slotId = ((Number) request.get("slotId")).longValue();
        BigDecimal totalAmount = new BigDecimal(request.get("totalAmount").toString());

        try {
            Booking booking = bookingService.initiateBooking(userId, turfId, slotId, totalAmount);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/participants/add")
    public ResponseEntity<?> addParticipant(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            bookingService.addParticipant(id, request.get("userId"));
            return ResponseEntity.ok("Participant added");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        try {
            return ResponseEntity.ok(bookingService.getBookingsByUserId(getCurrentUserId()));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @Autowired
    com.turfbook.backend.repository.UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).get().getId();
    }

    @PostMapping("/owner/book")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createOwnerBooking(@RequestBody Map<String, Object> request) {
        try {
            Long ownerId = getCurrentUserId();
            Long turfId = ((Number) request.get("turfId")).longValue();
            Long slotId = ((Number) request.get("slotId")).longValue();
            String customerName = (String) request.get("customerName");
            String customerPhone = (String) request.get("customerPhone");

            Booking booking = bookingService.createOwnerBooking(ownerId, turfId, slotId, customerName, customerPhone);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
