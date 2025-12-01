package com.turfbook.backend.dto.response;

import java.time.LocalDateTime;

public class MatchResponse {
    private Long id;
    private TeamResponse teamA;
    private TeamResponse teamB;
    private String status;
    private Long winnerTeamId;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TeamResponse getTeamA() {
        return teamA;
    }

    public void setTeamA(TeamResponse teamA) {
        this.teamA = teamA;
    }

    public TeamResponse getTeamB() {
        return teamB;
    }

    public void setTeamB(TeamResponse teamB) {
        this.teamB = teamB;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getWinnerTeamId() {
        return winnerTeamId;
    }

    public void setWinnerTeamId(Long winnerTeamId) {
        this.winnerTeamId = winnerTeamId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
