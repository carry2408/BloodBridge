package com.msrit.bloodbridge.features.team.dto.response;

import com.msrit.bloodbridge.common.enums.TeamStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TeamResponse {

    private Long id;

    private String teamName;

    private String teamCode;

    private String description;

    private TeamStatus status;

    private Long medicalPartnerId;

    private String medicalPartnerName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}