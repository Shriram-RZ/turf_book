package com.turfbook.backend.controller;

import com.turfbook.backend.dto.response.NotificationResponse;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.turfbook.backend.security.SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        Long userId = securityUtils.getCurrentUserId();
        // Map to DTO if needed, or return entity for now (as per service return type)
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            notificationService.markAsRead(id, userId);
            return ResponseEntity.ok("Marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            notificationService.deleteNotification(id, userId);
            return ResponseEntity.ok("Notification deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok("All marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
