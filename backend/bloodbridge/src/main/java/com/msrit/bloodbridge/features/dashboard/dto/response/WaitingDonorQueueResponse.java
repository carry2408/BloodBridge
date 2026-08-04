package com.msrit.bloodbridge.features.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WaitingDonorQueueResponse {

    private String registrationId;

    private String fullName;

    private Integer age;

    private String phoneNumber;

}