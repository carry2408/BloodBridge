package com.msrit.bloodbridge.features.medicalpartner.dto.response;

import com.msrit.bloodbridge.common.enums.MedicalPartnerStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicalPartnerResponse {

    private Long id;

    private String name;

    private String contactPerson;

    private String contactNumber;

    private String email;

    private String address;

    private MedicalPartnerStatus status;

    private Long campId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}