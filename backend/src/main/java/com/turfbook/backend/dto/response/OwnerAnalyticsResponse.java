package com.turfbook.backend.dto.response;

import java.math.BigDecimal;

public class OwnerAnalyticsResponse {
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private Integer activeBookings = 0;
    private Integer totalCustomers = 0;
    private Double occupancyRate = 0.0;

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(Integer activeBookings) {
        this.activeBookings = activeBookings;
    }

    public Integer getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Integer totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(Double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}
