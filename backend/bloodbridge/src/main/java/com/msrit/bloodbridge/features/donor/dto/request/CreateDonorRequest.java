package com.msrit.bloodbridge.features.donor.dto.request;

import com.msrit.bloodbridge.common.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateDonorRequest {

    @NotBlank
    private String fullName;

    @NotNull
    @Min(18)
    @Max(65)
    private Integer age;

    @NotNull
    private Gender gender;

    @NotBlank
    private String phoneNumber;

    private String email;

}