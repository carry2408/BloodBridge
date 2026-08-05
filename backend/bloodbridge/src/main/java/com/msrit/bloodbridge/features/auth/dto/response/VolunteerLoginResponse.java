package com.msrit.bloodbridge.features.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VolunteerLoginResponse {

    private String token;

    private String usn;

    private String volunteerName;

}