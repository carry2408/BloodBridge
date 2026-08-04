package com.msrit.bloodbridge.features.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryResponse {

    private Long totalRegistrations;

    private Long registered;

    private Long screened;

    private Long donated;

    private Long rejected;

    private Long totalVolunteers;

    private Long totalTeams;

    private Long totalMedicalPartners;

}
