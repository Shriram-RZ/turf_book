package com.turfbook.backend.dto.response;

public class OccupancyDataPoint {
    private String day;
    private Double occupancy;

    public OccupancyDataPoint() {
    }

    public OccupancyDataPoint(String day, Double occupancy) {
        this.day = day;
        this.occupancy = occupancy;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Double getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(Double occupancy) {
        this.occupancy = occupancy;
    }
}
