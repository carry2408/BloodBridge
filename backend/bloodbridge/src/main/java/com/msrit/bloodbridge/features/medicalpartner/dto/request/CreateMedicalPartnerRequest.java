package com.msrit.bloodbridge.features.medicalpartner.dto.request;

import jakarta.validation.constraints.NotBlank;
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