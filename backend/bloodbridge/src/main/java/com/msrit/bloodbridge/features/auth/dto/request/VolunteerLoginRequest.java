package com.msrit.bloodbridge.features.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VolunteerLoginRequest {

    @NotBlank
    private String usn;

    @NotBlank
    private String password;

}