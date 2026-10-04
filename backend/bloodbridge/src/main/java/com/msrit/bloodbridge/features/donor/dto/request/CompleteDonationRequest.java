package com.msrit.bloodbridge.features.donor.dto.request;

import lombok.Data;

@Data
public class CompleteDonationRequest {
    private Long volunteerId;
    private Double unitsDonated;
    private String bloodPressure;
    private Double sugarLevel;
    private Double hemoglobin;
    private String remarks;
}
