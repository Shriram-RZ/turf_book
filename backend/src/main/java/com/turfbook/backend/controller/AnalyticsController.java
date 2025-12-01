package com.turfbook.backend.controller;

import com.turfbook.backend.dto.response.AnalyticsResponse;
import com.turfbook.backend.dto.response.OwnerAnalyticsResponse;
import com.turfbook.backend.dto.response.RevenueDataPoint;
import com.turfbook.backend.dto.response.OccupancyDataPoint;
import com.turfbook.backend.security.UserDetailsImpl;
import com.turfbook.backend.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Get current authenticated user ID from security context
     * 
     * @return User ID
     * @throws IllegalStateException if authentication is invalid
     */
    @Autowired
    private com.turfbook.backend.security.SecurityUtils securityUtils;

    /**
     * Get analytics for the current authenticated user
     * 
     * @return User analytics
     */
    @GetMapping("/my")
    public ResponseEntity<AnalyticsResponse> getMyAnalytics() {
        logger.info("GET /api/analytics/my - Fetching user analytics");

        try {
            Long userId = securityUtils.getCurrentUserId();
            AnalyticsResponse response = analyticsService.getUserAnalytics(userId);
            logger.info("Successfully fetched analytics for userId: {}", userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getMyAnalytics", e);
            // Return empty response instead of 500
            return ResponseEntity.ok(new AnalyticsResponse());
        }
    }

    /**
     * Get detailed analytics for the current owner
     * Requires OWNER role
     * 
     * @return Owner analytics with revenue, bookings, customers, and occupancy
     */
    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<OwnerAnalyticsResponse> getOwnerAnalytics() {
        try {
            Long ownerId = securityUtils.getCurrentUserId();
            logger.info("GET /api/analytics/owner - Fetching owner analytics for ownerId: {}", ownerId);

            OwnerAnalyticsResponse response = analyticsService.getOwnerDetailedAnalytics(ownerId);

            logger.info("Successfully fetched owner analytics for ownerId: {}", ownerId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getOwnerAnalytics", e);
            // Return safe default response
            return ResponseEntity.ok(new OwnerAnalyticsResponse());
        }
    }

    /**
     * Get revenue data for the current owner over specified days
     * Requires OWNER role
     * 
     * @param days Number of days (default: 7, max: 365)
     * @return List of revenue data points
     */
    @GetMapping("/owner/revenue")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<RevenueDataPoint>> getOwnerRevenue(
            @RequestParam(defaultValue = "7") int days) {
        try {
            Long ownerId = securityUtils.getCurrentUserId();
            logger.info("GET /api/analytics/owner/revenue?days={} - Fetching revenue data for ownerId: {}", days,
                    ownerId);

            List<RevenueDataPoint> response = analyticsService.getOwnerRevenueData(ownerId, days);

            logger.info("Successfully fetched revenue data for ownerId: {}, returned {} data points",
                    ownerId, response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getOwnerRevenue", e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get occupancy data for the current owner over specified days
     * Requires OWNER role
     * 
     * @param days Number of days (default: 7, max: 365)
     * @return List of occupancy data points
     */
    @GetMapping("/owner/occupancy")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<OccupancyDataPoint>> getOwnerOccupancy(
            @RequestParam(defaultValue = "7") int days) {
        try {
            Long ownerId = securityUtils.getCurrentUserId();
            logger.info("GET /api/analytics/owner/occupancy?days={} - Fetching occupancy data for ownerId: {}", days,
                    ownerId);

            List<OccupancyDataPoint> response = analyticsService.getOwnerOccupancyData(ownerId, days);

            logger.info("Successfully fetched occupancy data for ownerId: {}, returned {} data points",
                    ownerId, response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in getOwnerOccupancy", e);
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
}
