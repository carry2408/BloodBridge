package com.msrit.bloodbridge.features.reports.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportSummaryResponse {

    private Long totalRegistered;
    private Long totalScreened;
    private Long totalDonated;
    private Long totalRejected;

}