package com.msrit.bloodbridge.features.volunteer.dto.response;

import com.msrit.bloodbridge.common.enums.VolunteerStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VolunteerResponse {

    private Long id;

    private String fullName;

    private String usn;

    private String phoneNumber;

    private String email;

    private VolunteerStatus status;

    private Long teamId;

    private String teamCode;

    private String teamName;

    private String generatedPassword;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}