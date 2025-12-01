package com.turfbook.backend.service;

import com.turfbook.backend.model.Friend;
import com.turfbook.backend.model.User;
import com.turfbook.backend.model.enums.FriendStatus;
import com.turfbook.backend.model.enums.NotificationType;
import com.turfbook.backend.repository.FriendRepository;
import com.turfbook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {
    @Autowired
    FriendRepository friendRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void sendFriendRequest(Long userId, String email) {
        org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(FriendService.class);
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        String trimmedEmail = email.trim();
        logger.info("Processing friend request from user {} to email {}", userId, trimmedEmail);

        User friend = userRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new RuntimeException("User with email " + trimmedEmail + " not found"));

        if (userId.equals(friend.getId())) {
            throw new RuntimeException("You cannot send a friend request to yourself");
        }

        // Check if friendship already exists
        Optional<Friend> existingFriendship = friendRepository.findByUserIdAndFriendId(userId, friend.getId());
        if (existingFriendship.isPresent()) {
            Friend existing = existingFriendship.get();
            if (existing.getStatus() == FriendStatus.ACCEPTED) {
                throw new RuntimeException("You are already friends with this user");
            } else if (existing.getStatus() == FriendStatus.SENT) {
                throw new RuntimeException("Friend request already sent");
            } else if (existing.getStatus() == FriendStatus.PENDING) {
                // If pending (meaning the other user sent a request), accept it automatically
                // Check if the reverse request (Them -> Me) is SENT
                Optional<Friend> reverseRequestOpt = friendRepository.findByUserIdAndFriendId(friend.getId(), userId);
                if (reverseRequestOpt.isPresent() && reverseRequestOpt.get().getStatus() == FriendStatus.SENT) {
                    acceptFriendRequest(userId, existing.getId());
                    return;
                } else {
                    throw new RuntimeException("A pending request from this user already exists. Please accept it.");
                }
            }
        }

        // Create friend request (User -> Friend)
        Friend request = new Friend();
        request.setUserId(userId);
        request.setFriendId(friend.getId());
        request.setUser(userRepository.getReferenceById(userId));
        request.setFriend(friend);
        request.setStatus(FriendStatus.SENT);
        friendRepository.save(request);

        // Create reverse entry (Friend -> User) with PENDING status
        Friend reverseRequest = new Friend();
        reverseRequest.setUserId(friend.getId());
        reverseRequest.setFriendId(userId);
        reverseRequest.setUser(friend);
        reverseRequest.setFriend(userRepository.getReferenceById(userId));
        reverseRequest.setStatus(FriendStatus.PENDING);
        friendRepository.save(reverseRequest);

        // Notification
        notificationService.createNotification(
                friend.getId(),
                NotificationType.REQUEST,
                "You have a new friend request from " + request.getUser().getName(),
                request.getId(),
                "FRIEND",
                true);
    }

    @Transactional
    public void sendFriendRequestById(Long userId, Long friendId) {
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        sendFriendRequest(userId, friend.getEmail());
    }

    @Transactional
    public void acceptFriendRequest(Long userId, Long requestId) {
        Friend request = friendRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        Friend receiverRecord;
        Friend senderRecord;

        // Case 1: requestId is the Sender's record (User=Sender, Friend=Me,
        // Status=SENT)
        if (request.getFriendId().equals(userId)
                && request.getStatus() == com.turfbook.backend.model.enums.FriendStatus.SENT) {
            senderRecord = request;
            // Find my record (Receiver's record)
            receiverRecord = friendRepository.findByUserIdAndFriendId(userId, request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Receiver record not found"));
        }
        // Case 2: requestId is the Receiver's record (User=Me, Friend=Sender,
        // Status=PENDING)
        else if (request.getUserId().equals(userId)
                && request.getStatus() == com.turfbook.backend.model.enums.FriendStatus.PENDING) {
            receiverRecord = request;
            // Find sender's record
            senderRecord = friendRepository.findByUserIdAndFriendId(request.getFriendId(), userId)
                    .orElseThrow(() -> new RuntimeException("Sender record not found"));
        } else {
            throw new RuntimeException("Invalid request or unauthorized");
        }

        // Update both to ACCEPTED
        receiverRecord.setStatus(FriendStatus.ACCEPTED);
        senderRecord.setStatus(FriendStatus.ACCEPTED);

        friendRepository.save(receiverRecord);
        friendRepository.save(senderRecord);

        // Notification
        notificationService.createNotification(
                senderRecord.getUserId(), // Notify the sender
                NotificationType.APPROVAL,
                receiverRecord.getUser().getName() + " accepted your friend request",
                receiverRecord.getId(),
                "FRIEND",
                false);
    }

    public void rejectFriendRequest(Long userId, Long requestId) {
        Friend request = friendRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getFriendId().equals(userId)) {
            throw new RuntimeException("Not authorized to reject this request");
        }

        request.setStatus(com.turfbook.backend.model.enums.FriendStatus.REJECTED);
        friendRepository.save(request);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        Optional<Friend> friendship = friendRepository.findFriendship(userId, friendId);
        if (friendship.isPresent()) {
            Friend f = friendship.get();
            f.setStatus(com.turfbook.backend.model.enums.FriendStatus.REMOVED);
            friendRepository.save(f);
        } else {
            throw new RuntimeException("Friendship not found");
        }
    }

    public List<Friend> getFriends(Long userId) {
        return friendRepository.findAll().stream()
                .filter(f -> f.getStatus() == com.turfbook.backend.model.enums.FriendStatus.ACCEPTED)
                .filter(f -> f.getUserId().equals(userId) || f.getFriendId().equals(userId))
                .collect(Collectors.toList());
    }

    public List<Friend> getPendingRequests(Long userId) {
        // Requests where I am the friendId (receiver) and status is SENT
        return friendRepository.findByFriendIdAndStatus(userId, com.turfbook.backend.model.enums.FriendStatus.SENT);
    }

    public List<Friend> getSentRequests(Long userId) {
        // Requests where I am the userId (sender) and status is SENT
        return friendRepository.findByUserIdAndStatus(userId, com.turfbook.backend.model.enums.FriendStatus.SENT);
    }

    public List<User> searchUsers(Long userId, String query) {
        List<User> users = userRepository.findByNameContainingIgnoreCase(query);

        // Get all interactions
        List<Friend> interactions = friendRepository.findAll().stream()
                .filter(f -> f.getUserId().equals(userId) || f.getFriendId().equals(userId))
                .collect(Collectors.toList());

        // Filter out Blocked or Accepted
        // Actually requirement says: "When typing a name, show only: Friends with
        // status = ACCEPTED, Users not already requested, Users not blocked"
        // Wait, "Dropdown friend search" usually means "Search for NEW friends".
        // "Show only: Friends with status = ACCEPTED" -> This implies searching WITHIN
        // friends?
        // OR "Users not already requested" -> searching for new people.

        // Let's assume this is a general "Search Users" to add.
        // So we should exclude people we already sent requests to, or are already
        // friends with?
        // Requirement: "Show only: Friends with status = ACCEPTED, Users not already
        // requested, Users not blocked"

        // Let's return all users, but maybe mark their status?
        // Or just filter as requested.

        // Simplification: Return users who are NOT (Blocked).
        // If they are friends, we can show them.
        // If request sent, maybe don't show? "Users not already requested".

        // Let's filter out users where a request is PENDING/SENT or BLOCKED.
        // Keep ACCEPTED (Friends) and NULL (New people).

        return users.stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> {
                    Optional<Friend> f = interactions.stream()
                            .filter(i -> i.getUserId().equals(u.getId()) || i.getFriendId().equals(u.getId()))
                            .findFirst();

                    if (f.isPresent()) {
                        com.turfbook.backend.model.enums.FriendStatus status = f.get().getStatus();
                        if (status == com.turfbook.backend.model.enums.FriendStatus.BLOCKED)
                            return false;
                        if (status == com.turfbook.backend.model.enums.FriendStatus.SENT)
                            return false; // Already requested
                        // If ACCEPTED, keep them (as per "Friends with status = ACCEPTED")
                        // If REJECTED/REMOVED, keep them (can request again)
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
}
