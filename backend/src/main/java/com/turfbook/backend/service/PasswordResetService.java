package com.turfbook.backend.service;

import com.turfbook.backend.model.User;
import com.turfbook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void initiatePasswordReset(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String token = UUID.randomUUID().toString();
            // In a real app: Save token to DB with expiration and send email
            System.out.println("Password reset token for " + email + ": " + token);
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        // In a real app: Verify token from DB
        // For MVP: We'll assume the token is valid if it's not empty (Mock)
        // This is INSECURE and strictly for MVP demonstration where we can't send
        // emails.
        // To make this work without email, we'd need a way to get the token.
        // For now, we will just return true to simulate success.
        return true;
    }

    public boolean resetPasswordByEmail(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
