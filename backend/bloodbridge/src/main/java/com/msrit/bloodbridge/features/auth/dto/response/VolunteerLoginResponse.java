package com.msrit.bloodbridge.features.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VolunteerLoginResponse {

    private Long id;

    private String token;

    private String usn;

    private String volunteerName;

    private Long teamId;

    private String teamName;

}