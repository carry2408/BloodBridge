package com.msrit.bloodbridge.features.camp.dto.response;

import com.msrit.bloodbridge.common.enums.CampStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CampResponse {
    private Long id;

    private String campName;

    private String description;

    private String venue;

    private LocalDate campDate;

    private LocalDateTime registrationStart;

    private LocalDateTime registrationEnd;

    private CampStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
