package com.msrit.bloodbridge.features.reports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MedicalPartnerReportResponse {

    private String medicalPartnerName;

    private Long successfulDonations;

}
