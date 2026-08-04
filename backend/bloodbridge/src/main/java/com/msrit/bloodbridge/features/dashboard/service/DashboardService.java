package com.msrit.bloodbridge.features.dashboard.service;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.dashboard.dto.response.DashboardSummaryResponse;
import com.msrit.bloodbridge.features.donor.repository.DonorRepository;
import com.msrit.bloodbridge.features.medicalpartner.repository.MedicalPartnerRepository;
import com.msrit.bloodbridge.features.team.repository.TeamRepository;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final DonorRepository donorRepository;
    private final TeamRepository  teamRepository;
    private final VolunteerRepository volunteerRepository;
    private final MedicalPartnerRepository medicalPartnerRepository;

    //to get all the summary for dashboard frontend
    public ApiResponse<DashboardSummaryResponse> getSummary() {
        DashboardSummaryResponse response =
                DashboardSummaryResponse.builder()
                        .totalRegistrations(donorRepository.count())
                        .registered(donorRepository.countByStatus(DonorStatus.REGISTERED))
                        .screened(donorRepository.countByStatus(DonorStatus.SCREENED))
                        .donated(donorRepository.countByStatus(DonorStatus.DONATED))
                        .rejected(donorRepository.countByStatus(DonorStatus.REJECTED))
                        .totalVolunteers(volunteerRepository.count())
                        .totalTeams(teamRepository.count())
                        .totalMedicalPartners(medicalPartnerRepository.count())
                        .build();

        return ApiResponse.success("Dashboard summary fetched successfully",response);
    }


}
