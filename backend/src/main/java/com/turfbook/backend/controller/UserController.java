package com.turfbook.backend.controller;

import com.turfbook.backend.model.User;
import com.turfbook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private com.turfbook.backend.security.SecurityUtils securityUtils;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Long userId = securityUtils.getCurrentUserId();
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody User userUpdates) {
        Long userId = securityUtils.getCurrentUserId();
        return userRepository.findById(userId)
                .map(user -> {
                    if (userUpdates.getName() != null)
                        user.setName(userUpdates.getName());
                    if (userUpdates.getPhone() != null)
                        user.setPhone(userUpdates.getPhone());
                    if (userUpdates.getAvatarUrl() != null)
                        user.setAvatarUrl(userUpdates.getAvatarUrl());
                    // Don't allow updating email/role/password here for simplicity
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        // Simple search by name or email
        // In real app, use a more robust search or Specification
        // For now, we'll assume we have a custom query or just filter all (inefficient
        // but works for MVP)
        // Let's add a method to repository
        List<User> users = userRepository.findByNameContainingOrEmailContaining(query, query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
