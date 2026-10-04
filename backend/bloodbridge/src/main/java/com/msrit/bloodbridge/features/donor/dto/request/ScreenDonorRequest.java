package com.msrit.bloodbridge.features.donor.dto.request;

import com.msrit.bloodbridge.common.enums.BloodGroup;
import com.msrit.bloodbridge.common.enums.DonorStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class ScreenDonorRequest {

    @NotNull
    private BloodGroup bloodGroup;

    @NotNull
    @DecimalMin("40.0")
    private Double weight;

    private Double unitsDonated;

    private String bloodPressure;

    private Double sugarLevel;

    private Double hemoglobin;

    private String remarks;

    @NotNull
    private Long volunteerId;

    @NotNull
    private DonorStatus status;

}