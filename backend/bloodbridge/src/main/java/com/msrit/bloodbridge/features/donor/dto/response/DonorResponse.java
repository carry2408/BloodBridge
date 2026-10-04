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

    private Double unitsDonated;

    private String bloodPressure;

    private Double sugarLevel;

    private Double hemoglobin;

    private String remarks;

    private DonorStatus status;

    private Long volunteerId;

    private String volunteerName;

    private Long teamId;

    private String teamName;

    private String teamCode;

    private Long campId;

    private String campName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}