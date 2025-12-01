package com.turfbook.backend.service;

import com.turfbook.backend.dto.response.UserResponse;
import com.turfbook.backend.model.User;
import com.turfbook.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user management operations
 */
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long userId) {
        logger.debug("Fetching user by ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return toUserResponse(user);
    }

    /**
     * Get user by email
     */
    public UserResponse getUserByEmail(String email) {
        logger.debug("Fetching user by email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return toUserResponse(user);
    }

    /**
     * Search users by name
     */
    public List<UserResponse> searchUsersByName(String name) {
        logger.debug("Searching users by name: {}", name);

        List<User> users = userRepository.findByNameContainingIgnoreCase(name);

        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserResponse updateProfile(Long userId, String name, String phone, String avatarUrl) {
        logger.info("Updating profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        if (phone != null) {
            user.setPhone(phone);
        }

        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
        }

        User updatedUser = userRepository.save(user);

        logger.info("Profile updated successfully for user: {}", userId);

        return toUserResponse(updatedUser);
    }

    /**
     * Update user skill rating (called after match completion)
     */
    @Transactional
    public void updateSkillRating(Long userId, int newRating) {
        logger.info("Updating skill rating for user {} to {}", userId, newRating);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setSkillRating(newRating);
        userRepository.save(user);
    }

    /**
     * Increment match statistics
     */
    @Transactional
    public void incrementMatchStats(Long userId, boolean won) {
        logger.info("Incrementing match stats for user {}, won: {}", userId, won);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setMatchesPlayed(user.getMatchesPlayed() + 1);

        if (won) {
            user.setMatchesWon(user.getMatchesWon() + 1);
        }

        // Update level based on matches played
        updateLevel(user);

        userRepository.save(user);
    }

    /**
     * Update user level based on matches played
     */
    private void updateLevel(User user) {
        int matchesPlayed = user.getMatchesPlayed();

        // Simple level calculation: 1 level per 10 matches
        int newLevel = 1 + (matchesPlayed / 10);

        if (newLevel != user.getLevel()) {
            user.setLevel(newLevel);
            user.setLevelProgress(0);
            logger.info("User {} leveled up to level {}", user.getId(), newLevel);
        } else {
            user.setLevelProgress(matchesPlayed % 10);
        }
    }

    /**
     * Get user statistics
     */
    public UserResponse getUserStats(Long userId) {
        logger.debug("Fetching stats for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return toUserResponse(user);
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setSkillRating(user.getSkillRating());
        response.setMatchesPlayed(user.getMatchesPlayed());
        response.setMatchesWon(user.getMatchesWon());
        response.setLevel(user.getLevel());
        response.setLevelProgress(user.getLevelProgress());
        response.setEnabled(user.getEnabled());
        return response;
    }
}
