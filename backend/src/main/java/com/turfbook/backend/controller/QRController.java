package com.turfbook.backend.controller;

import com.turfbook.backend.model.Booking;
import com.turfbook.backend.model.Booking;
import com.turfbook.backend.model.enums.BookingStatus;
import com.turfbook.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/qr")
public class QRController {
    @Autowired
    BookingRepository bookingRepository;

    @PostMapping("/scan")
    public ResponseEntity<?> scanQR(@RequestBody Map<String, String> request) {
        String secret = request.get("qrSecret");

        Booking booking = bookingRepository.findAll().stream()
                .filter(b -> secret.equals(b.getQrSecret()))
                .findFirst()
                .orElse(null);

        if (booking == null) {
            return ResponseEntity.badRequest().body("Invalid QR Code");
        }

        if (BookingStatus.CONFIRMED != booking.getStatus()) {
            return ResponseEntity.badRequest().body("Booking not confirmed");
        }

        if (booking.getCheckedInAt() != null) {
            return ResponseEntity.badRequest().body("Already checked in");
        }

        booking.setCheckedInAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        return ResponseEntity.ok("Check-in successful");
    }
}
