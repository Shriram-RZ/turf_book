package com.turfbook.backend.controller;

import com.turfbook.backend.service.BookingService;
import com.turfbook.backend.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class SplitPaymentController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private SecurityUtils securityUtils;

    @PostMapping("/{bookingId}/add")
    public ResponseEntity<?> addParticipant(@PathVariable Long bookingId, @RequestParam Long userId) {
        try {
            bookingService.addParticipant(bookingId, userId);
            // added here
            return ResponseEntity.ok("Participant added successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{bookingId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            bookingService.updateParticipantStatus(bookingId, userId, status);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
