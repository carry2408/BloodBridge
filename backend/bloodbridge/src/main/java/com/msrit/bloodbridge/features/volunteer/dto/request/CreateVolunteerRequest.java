package com.msrit.bloodbridge.features.volunteer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVolunteerRequest {

    @NotBlank
    private String fullName;

    private String usn;

    @NotBlank
    private String phoneNumber;

    private String email;

    @NotNull
    private Long teamId;
}