package com.turfbook.backend.service;

import com.turfbook.backend.dto.AnalyticsDTO;
import com.turfbook.backend.dto.response.OwnerAnalyticsResponse;
import com.turfbook.backend.dto.response.RevenueDataPoint;
import com.turfbook.backend.dto.response.OccupancyDataPoint;
import com.turfbook.backend.repository.BookingRepository;
import com.turfbook.backend.repository.TurfSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AnalyticsServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TurfSlotRepository turfSlotRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getOwnerDetailedAnalytics_ShouldReturnCorrectAnalytics() {
        Long ownerId = 1L;

        when(bookingRepository.calculateTotalRevenueByOwnerId(ownerId)).thenReturn(new BigDecimal("3000"));
        when(bookingRepository.countActiveBookingsByOwnerId(ownerId)).thenReturn(5);
        when(bookingRepository.countUniqueCustomersByOwnerId(ownerId)).thenReturn(10L);

        // Mock occupancy stats: [date, totalSlots, bookedSlots]
        List<Object[]> occupancyStats = new ArrayList<>();
        occupancyStats.add(new Object[] { LocalDate.now(), 10L, 5L }); // 50% occupancy
        when(turfSlotRepository.getDailyOccupancyStats(eq(ownerId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(occupancyStats);

        OwnerAnalyticsResponse response = analyticsService.getOwnerDetailedAnalytics(ownerId);

        assertEquals(new BigDecimal("3000"), response.getTotalRevenue());
        assertEquals(5, response.getActiveBookings());
        assertEquals(10, response.getTotalCustomers());
        assertEquals(50.0, response.getOccupancyRate());

        verify(bookingRepository).calculateTotalRevenueByOwnerId(ownerId);
        verify(bookingRepository).countActiveBookingsByOwnerId(ownerId);
        verify(bookingRepository).countUniqueCustomersByOwnerId(ownerId);
    }

    @Test
    void getOwnerDetailedAnalytics_ShouldHandleNulls() {
        Long ownerId = 1L;

        when(bookingRepository.calculateTotalRevenueByOwnerId(ownerId)).thenReturn(null);
        when(bookingRepository.countActiveBookingsByOwnerId(ownerId)).thenReturn(null);
        when(bookingRepository.countUniqueCustomersByOwnerId(ownerId)).thenReturn(null);
        when(turfSlotRepository.getDailyOccupancyStats(eq(ownerId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        OwnerAnalyticsResponse response = analyticsService.getOwnerDetailedAnalytics(ownerId);

        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertEquals(0, response.getActiveBookings());
        assertEquals(0, response.getTotalCustomers());
        assertEquals(0.0, response.getOccupancyRate());
    }

    @Test
    void getOwnerRevenueData_ShouldReturnDataPoints() {
        Long ownerId = 1L;
        int days = 7;

        List<AnalyticsDTO.DailyRevenueDTO> revenueList = new ArrayList<>();
        revenueList.add(new AnalyticsDTO.DailyRevenueDTO(LocalDate.now().toString(), new BigDecimal("100")));

        when(bookingRepository.getDailyRevenue(eq(ownerId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(revenueList);

        List<RevenueDataPoint> result = analyticsService.getOwnerRevenueData(ownerId, days);

        assertNotNull(result);
        assertEquals(days, result.size()); // Should return points for all days including zero days

        // Verify one point has data
        boolean foundData = result.stream().anyMatch(p -> p.getAmount().compareTo(new BigDecimal("100")) == 0);
        assertTrue(foundData);
    }

    @Test
    void getOwnerOccupancyData_ShouldReturnDataPoints() {
        Long ownerId = 1L;
        int days = 7;

        List<Object[]> stats = new ArrayList<>();
        stats.add(new Object[] { LocalDate.now(), 10L, 5L }); // 50%

        when(turfSlotRepository.getDailyOccupancyStats(eq(ownerId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(stats);

        List<OccupancyDataPoint> result = analyticsService.getOwnerOccupancyData(ownerId, days);

        assertNotNull(result);
        assertEquals(days, result.size());

        boolean foundData = result.stream().anyMatch(p -> p.getOccupancy() == 50.0);
        assertTrue(foundData);
    }
}
