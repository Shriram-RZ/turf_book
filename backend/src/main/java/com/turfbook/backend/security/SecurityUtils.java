package com.turfbook.backend.security;

import com.turfbook.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private static final Logger logger = LoggerFactory.getLogger(SecurityUtils.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Safely retrieves the current authenticated user's ID.
     *
     * @return The ID of the current user.
     * @throws IllegalStateException if the user is not authenticated or the
     *                               principal is invalid.
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("No authentication found in SecurityContext");
            throw new IllegalStateException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl) {
            Long userId = ((UserDetailsImpl) principal).getId();
            if (userId == null) {
                logger.error("User ID is null in UserDetailsImpl");
                throw new IllegalStateException("User ID is missing from authentication details");
            }
            return userId;
        } else if (principal instanceof String && "anonymousUser".equals(principal)) {
            logger.error("Anonymous user attempted to access protected resource");
            throw new IllegalStateException("User is not authenticated");
        }

        logger.error("Unknown principal type: {}", principal.getClass().getName());
        throw new IllegalStateException("Invalid authentication principal");
    }
}
