package com.turfbook.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

public class AnalyticsDTO {

    @Data
    @NoArgsConstructor
    public static class DailyRevenueDTO {
        private String date;
        private BigDecimal amount;

        public DailyRevenueDTO(String date, BigDecimal amount) {
            this.date = date;
            this.amount = amount;
        }

        // Constructor for JPQL results where date might be Object
        public DailyRevenueDTO(Object date, BigDecimal amount) {
            this.date = String.valueOf(date);
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyOccupancyDTO {
        private String date;
        private Double occupancyRate;

        public DailyOccupancyDTO(String date, Double occupancyRate) {
            this.date = date;
            this.occupancyRate = occupancyRate;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Double getOccupancyRate() {
            return occupancyRate;
        }

        public void setOccupancyRate(Double occupancyRate) {
            this.occupancyRate = occupancyRate;
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OwnerDashboardDTO {
        private BigDecimal totalRevenue;
        private Integer activeBookings;
        private Integer totalCustomers;
        private Double occupancyRate;

        public OwnerDashboardDTO(BigDecimal totalRevenue, Integer activeBookings, Integer totalCustomers,
                Double occupancyRate) {
            this.totalRevenue = totalRevenue;
            this.activeBookings = activeBookings;
            this.totalCustomers = totalCustomers;
            this.occupancyRate = occupancyRate;
        }

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
}
