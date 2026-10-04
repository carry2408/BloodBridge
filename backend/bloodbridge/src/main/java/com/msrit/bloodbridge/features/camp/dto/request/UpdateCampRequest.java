package com.msrit.bloodbridge.features.camp.dto.request;

import com.msrit.bloodbridge.common.enums.CampStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UpdateCampRequest {

    @NotBlank
    private String campName;

    private String description;

    @NotBlank
    private String venue;

    @NotNull
    private LocalDate campDate;

    @NotNull
    private LocalDateTime registrationStart;

    @NotNull
    private LocalDateTime registrationEnd;

    private CampStatus status;
}