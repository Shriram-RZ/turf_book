package com.turfbook.backend.service;

import com.turfbook.backend.dto.response.OwnerAnalyticsResponse;
import com.turfbook.backend.dto.response.RevenueDataPoint;
import com.turfbook.backend.repository.BookingRepository;
import com.turfbook.backend.repository.TurfSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

public class AnalyticsServiceNullSafetyTest {

    @InjectMocks
    private AnalyticsService analyticsService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TurfSlotRepository turfSlotRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetOwnerDetailedAnalytics_AllNulls() {
        // Mock repositories returning null
        when(bookingRepository.calculateTotalRevenueByOwnerId(anyLong())).thenReturn(null);
        when(bookingRepository.countActiveBookingsByOwnerId(anyLong())).thenReturn(null);
        when(bookingRepository.countUniqueCustomersByOwnerId(anyLong())).thenReturn(null);
        when(turfSlotRepository.getDailyOccupancyStats(anyLong(), any(), any())).thenReturn(null);

        OwnerAnalyticsResponse response = analyticsService.getOwnerDetailedAnalytics(1L);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertEquals(0, response.getActiveBookings());
        assertEquals(0, response.getTotalCustomers());
        assertEquals(0.0, response.getOccupancyRate());
    }

    @Test
    void testGetOwnerRevenueData_EmptyData() {
        when(bookingRepository.getDailyRevenue(anyLong(), any(), any())).thenReturn(Collections.emptyList());

        List<RevenueDataPoint> response = analyticsService.getOwnerRevenueData(1L, 7);

        assertNotNull(response);
        assertEquals(7, response.size());
        for (RevenueDataPoint point : response) {
            assertEquals(BigDecimal.ZERO, point.getAmount());
        }
    }

    @Test
    void testGetOwnerRevenueData_NullReturn() {
        when(bookingRepository.getDailyRevenue(anyLong(), any(), any())).thenReturn(null);

        List<RevenueDataPoint> response = analyticsService.getOwnerRevenueData(1L, 7);

        assertNotNull(response);
        assertEquals(7, response.size());
        for (RevenueDataPoint point : response) {
            assertEquals(BigDecimal.ZERO, point.getAmount());
        }
    }
}
