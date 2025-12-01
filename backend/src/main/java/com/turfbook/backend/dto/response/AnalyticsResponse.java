package com.turfbook.backend.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class AnalyticsResponse {
    private Integer totalBookings;
    private BigDecimal totalSpent;
    private Integer matchesPlayed;
    private Integer matchesWon;
    private Map<String, Integer> bookingsByTurf;

    private BigDecimal totalRevenue;
    private Long activeTurfs;
    private Long totalUsers;

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getActiveTurfs() {
        return activeTurfs;
    }

    public void setActiveTurfs(Long activeTurfs) {
        this.activeTurfs = activeTurfs;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(Integer matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }

    public Integer getMatchesWon() {
        return matchesWon;
    }

    public void setMatchesWon(Integer matchesWon) {
        this.matchesWon = matchesWon;
    }

    public Map<String, Integer> getBookingsByTurf() {
        return bookingsByTurf;
    }

    public void setBookingsByTurf(Map<String, Integer> bookingsByTurf) {
        this.bookingsByTurf = bookingsByTurf;
    }
}
