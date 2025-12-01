package com.turfbook.backend.controller;

import com.turfbook.backend.model.Friend;
import com.turfbook.backend.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/friends")
public class FriendController {
    @Autowired
    FriendService friendService;

    @Autowired
    com.turfbook.backend.repository.UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).get().getId();
    }

    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(@RequestBody com.turfbook.backend.dto.FriendInviteRequest request) {
        org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(FriendController.class);
        logger.info("Received invite payload: {}", request);
        try {
            Long currentUserId = getCurrentUserId();
            friendService.sendFriendRequest(currentUserId, request.getEmail());
            return ResponseEntity.ok("Friend request sent");
        } catch (RuntimeException e) {
            logger.error("Invite failed", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptInvite(@PathVariable Long requestId) {
        try {
            friendService.acceptFriendRequest(getCurrentUserId(), requestId);
            return ResponseEntity.ok("Friend request accepted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectInvite(@PathVariable Long requestId) {
        try {
            friendService.rejectFriendRequest(getCurrentUserId(), requestId);
            return ResponseEntity.ok("Friend request rejected");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/requests")
    public List<Friend> getPendingRequests() {
        return friendService.getPendingRequests(getCurrentUserId());
    }

    @GetMapping("/requests/sent")
    public List<Friend> getSentRequests() {
        return friendService.getSentRequests(getCurrentUserId());
    }

    @GetMapping
    public List<Friend> getFriends() {
        return friendService.getFriends(getCurrentUserId());
    }

    // Alias for /friends/list
    @GetMapping("/list")
    public List<Friend> getFriendsList() {
        return getFriends();
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId) {
        try {
            friendService.removeFriend(getCurrentUserId(), friendId);
            return ResponseEntity.ok("Friend removed");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public List<com.turfbook.backend.model.User> searchUsers(@RequestParam String query) {
        return friendService.searchUsers(getCurrentUserId(), query);
    }

    @PostMapping("/request/{userId}")
    public ResponseEntity<?> sendRequestById(@PathVariable Long userId) {
        try {
            friendService.sendFriendRequestById(getCurrentUserId(), userId);
            return ResponseEntity.ok("Friend request sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
