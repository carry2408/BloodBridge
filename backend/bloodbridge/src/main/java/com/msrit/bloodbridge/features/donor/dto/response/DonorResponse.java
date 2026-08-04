package com.msrit.bloodbridge.features.donor.dto.response;

import com.msrit.bloodbridge.common.enums.BloodGroup;
import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DonorResponse {

    private Long id;

    private String registrationId;

    private String fullName;

    private Integer age;

    private Gender gender;

    private String phoneNumber;

    private String email;

    private BloodGroup bloodGroup;

    private Double weight;

    private String remarks;

    private DonorStatus status;

    private Long volunteerId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}