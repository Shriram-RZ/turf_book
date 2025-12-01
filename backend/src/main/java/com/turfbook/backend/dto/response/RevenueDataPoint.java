package com.turfbook.backend.dto.response;

import java.math.BigDecimal;

public class RevenueDataPoint {
    private String date;
    private BigDecimal amount;

    public RevenueDataPoint() {
    }

    public RevenueDataPoint(String date, BigDecimal amount) {
        this.date = date;
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
