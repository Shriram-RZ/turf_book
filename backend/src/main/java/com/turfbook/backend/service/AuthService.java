package com.turfbook.backend.service;

import com.turfbook.backend.dto.request.LoginRequest;
import com.turfbook.backend.dto.request.RegisterRequest;
import com.turfbook.backend.dto.response.JwtResponse;
import com.turfbook.backend.dto.response.UserResponse;
import com.turfbook.backend.model.User;
import com.turfbook.backend.model.enums.UserRole;
import com.turfbook.backend.repository.UserRepository;
import com.turfbook.backend.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for authentication operations
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Authenticate user and generate JWT token
     */
    public JwtResponse login(LoginRequest loginRequest) {
        logger.info("Attempting login for user: {}", loginRequest.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        logger.info("Login successful for user: {}", user.getEmail());

        // Create response
        return new JwtResponse(
                jwt,
                null, // Refresh token not implemented yet
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole());
    }

    /**
     * Register a new user
     */
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        logger.info("Attempting to register user: {}", registerRequest.getEmail());

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : UserRole.USER);
        user.setEnabled(true);

        // Save user
        User savedUser = userRepository.save(user);

        logger.info("User registered successfully: {}", savedUser.getEmail());

        // Convert to response
        return toUserResponse(savedUser);
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
