package com.turfbook.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public class MatchRequest {
    @NotNull(message = "Team ID is required")
    private Long teamId;

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}
