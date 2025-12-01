package com.turfbook.backend.service;

import com.turfbook.backend.dto.AnalyticsDTO;
import com.turfbook.backend.dto.response.AnalyticsResponse;
import com.turfbook.backend.dto.response.OwnerAnalyticsResponse;
import com.turfbook.backend.dto.response.RevenueDataPoint;
import com.turfbook.backend.dto.response.OccupancyDataPoint;
import com.turfbook.backend.model.Booking;
import com.turfbook.backend.model.Team;
import com.turfbook.backend.repository.BookingRepository;
import com.turfbook.backend.repository.TeamRepository;
import com.turfbook.backend.repository.TurfSlotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TurfSlotRepository turfSlotRepository;

    @Transactional(readOnly = true)
    public AnalyticsResponse getUserAnalytics(Long userId) {
        logger.info("Fetching user analytics for userId: {}", userId);

        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        AnalyticsResponse response = new AnalyticsResponse();

        try {
            List<Booking> bookings = bookingRepository.findByUserId(userId);
            if (bookings == null)
                bookings = new ArrayList<>();

            response.setTotalBookings(bookings.size());

            BigDecimal totalSpent = bookings.stream()
                    .map(Booking::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            response.setTotalSpent(totalSpent);

            List<Team> teams = teamRepository.findByMembersId(userId);
            if (teams == null)
                teams = new ArrayList<>();

            int matchesPlayed = teams.stream()
                    .mapToInt(team -> team.getMatchesPlayed() != null ? team.getMatchesPlayed() : 0)
                    .sum();
            int matchesWon = teams.stream()
                    .mapToInt(team -> team.getMatchesWon() != null ? team.getMatchesWon() : 0)
                    .sum();
            response.setMatchesPlayed(matchesPlayed);
            response.setMatchesWon(matchesWon);

            Map<String, Integer> bookingsByTurf = new HashMap<>();
            for (Booking booking : bookings) {
                if (booking.getTurf() != null && booking.getTurf().getName() != null) {
                    String turfName = booking.getTurf().getName();
                    bookingsByTurf.put(turfName, bookingsByTurf.getOrDefault(turfName, 0) + 1);
                }
            }
            response.setBookingsByTurf(bookingsByTurf);

            return response;
        } catch (Exception e) {
            logger.error("Error fetching user analytics for userId: {}", userId, e);
            // Return empty response instead of failing
            return response;
        }
    }

    @Transactional(readOnly = true)
    public OwnerAnalyticsResponse getOwnerDetailedAnalytics(Long ownerId) {
        logger.info("Fetching detailed owner analytics for ownerId: {}", ownerId);

        if (ownerId == null) {
            throw new IllegalArgumentException("Owner ID cannot be null");
        }

        OwnerAnalyticsResponse response = new OwnerAnalyticsResponse();

        try {
            // 1. Total Revenue
            BigDecimal totalRevenue = bookingRepository.calculateTotalRevenueByOwnerId(ownerId);
            response.setTotalRevenue(Objects.requireNonNullElse(totalRevenue, BigDecimal.ZERO));

            // 2. Active Bookings
            Integer activeBookings = bookingRepository.countActiveBookingsByOwnerId(ownerId);
            response.setActiveBookings(Objects.requireNonNullElse(activeBookings, 0));

            // 3. Total Customers
            Long uniqueCustomers = bookingRepository.countUniqueCustomersByOwnerId(ownerId);
            response.setTotalCustomers(uniqueCustomers != null ? uniqueCustomers.intValue() : 0);

            // 4. Overall Occupancy Rate (Last 30 days for relevance)
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(30);

            List<Object[]> occupancyStats = turfSlotRepository.getDailyOccupancyStats(ownerId, startDate, endDate);

            long totalSlots = 0;
            long bookedSlots = 0;

            if (occupancyStats != null) {
                for (Object[] stat : occupancyStats) {
                    if (stat != null && stat.length >= 3) {
                        totalSlots += stat[1] != null ? ((Number) stat[1]).longValue() : 0;
                        bookedSlots += stat[2] != null ? ((Number) stat[2]).longValue() : 0;
                    }
                }
            }

            double occupancyRate = totalSlots > 0 ? (bookedSlots * 100.0 / totalSlots) : 0.0;
            response.setOccupancyRate(occupancyRate);

            return response;
        } catch (Exception e) {
            logger.error("Error fetching detailed analytics for ownerId: {}", ownerId, e);
            // Return safe default response
            return new OwnerAnalyticsResponse();
        }
    }

    @Transactional(readOnly = true)
    public List<RevenueDataPoint> getOwnerRevenueData(Long ownerId, int days) {
        if (ownerId == null)
            throw new IllegalArgumentException("Owner ID cannot be null");
        if (days <= 0 || days > 365)
            days = 7; // Default to 7 if invalid

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<RevenueDataPoint> dataPoints = new ArrayList<>();
        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("MMM dd");

        try {
            List<AnalyticsDTO.DailyRevenueDTO> revenueList = bookingRepository.getDailyRevenue(ownerId, startDateTime,
                    endDateTime);

            Map<String, BigDecimal> revenueMap = new HashMap<>();
            if (revenueList != null) {
                for (AnalyticsDTO.DailyRevenueDTO dto : revenueList) {
                    if (dto.getDate() != null) {
                        revenueMap.put(dto.getDate(), Objects.requireNonNullElse(dto.getAmount(), BigDecimal.ZERO));
                    }
                }
            }

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                String key = date.toString(); // ISO format matches SQL date format
                BigDecimal amount = revenueMap.getOrDefault(key, BigDecimal.ZERO);
                dataPoints.add(new RevenueDataPoint(date.format(displayFormatter), amount));
            }

            return dataPoints;
        } catch (Exception e) {
            logger.error("Error fetching revenue data for ownerId: {}", ownerId, e);
            // Return empty list with zero values for the requested days
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                dataPoints.add(new RevenueDataPoint(date.format(displayFormatter), BigDecimal.ZERO));
            }
            return dataPoints;
        }
    }

    @Transactional(readOnly = true)
    public List<OccupancyDataPoint> getOwnerOccupancyData(Long ownerId, int days) {
        if (ownerId == null)
            throw new IllegalArgumentException("Owner ID cannot be null");
        if (days <= 0 || days > 365)
            days = 7;

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        List<OccupancyDataPoint> dataPoints = new ArrayList<>();
        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("EEE");

        try {
            List<Object[]> stats = turfSlotRepository.getDailyOccupancyStats(ownerId, startDate, endDate);

            Map<LocalDate, Double> occupancyMap = new HashMap<>();
            if (stats != null) {
                for (Object[] stat : stats) {
                    if (stat != null && stat.length >= 3 && stat[0] != null) {
                        // Handle potential type mismatches from JPA native queries
                        LocalDate date;
                        if (stat[0] instanceof java.sql.Date) {
                            date = ((java.sql.Date) stat[0]).toLocalDate();
                        } else {
                            date = (LocalDate) stat[0];
                        }

                        long total = stat[1] != null ? ((Number) stat[1]).longValue() : 0;
                        long booked = stat[2] != null ? ((Number) stat[2]).longValue() : 0;
                        double rate = total > 0 ? (booked * 100.0 / total) : 0.0;
                        occupancyMap.put(date, rate);
                    }
                }
            }

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                Double rate = occupancyMap.getOrDefault(date, 0.0);
                dataPoints.add(new OccupancyDataPoint(date.format(displayFormatter), rate));
            }

            return dataPoints;
        } catch (Exception e) {
            logger.error("Error fetching occupancy data for ownerId: {}", ownerId, e);
            // Return zeroed data
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                dataPoints.add(new OccupancyDataPoint(date.format(displayFormatter), 0.0));
            }
            return dataPoints;
        }
    }
}
