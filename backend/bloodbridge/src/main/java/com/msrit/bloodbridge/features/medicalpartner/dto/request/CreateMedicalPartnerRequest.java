package com.msrit.bloodbridge.features.medicalpartner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMedicalPartnerRequest {

    @NotBlank
    private String name;

    private String contactPerson;

    private String contactNumber;

    private String email;

    private String address;

}