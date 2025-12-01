package com.turfbook.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class TeamRequest {
    @NotBlank(message = "Team name is required")
    private String name;

    private String logoUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
