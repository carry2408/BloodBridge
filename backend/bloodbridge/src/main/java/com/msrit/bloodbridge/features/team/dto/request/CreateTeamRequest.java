package com.msrit.bloodbridge.features.team.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTeamRequest {

    @NotBlank
    private String teamName;

    private String description;

    @NotNull
    private Long medicalPartnerId;

}