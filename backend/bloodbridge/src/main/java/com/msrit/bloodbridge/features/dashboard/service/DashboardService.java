package com.msrit.bloodbridge.features.dashboard.service;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.dashboard.dto.response.DashboardSummaryResponse;
import com.msrit.bloodbridge.features.dashboard.dto.response.WaitingDonorQueueResponse;
import com.msrit.bloodbridge.features.donor.entity.Donor;
import com.msrit.bloodbridge.features.donor.repository.DonorRepository;
import com.msrit.bloodbridge.features.medicalpartner.repository.MedicalPartnerRepository;
import com.msrit.bloodbridge.features.team.repository.TeamRepository;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public ApiResponse<List<WaitingDonorQueueResponse>> getWaitingForScreening() {
        List<Donor> donors = donorRepository.findByStatus(DonorStatus.REGISTERED);

        List<WaitingDonorQueueResponse> waitingForScreeningResponseList = donors.stream()
                .map((donor)->{
                    return WaitingDonorQueueResponse.builder()
                            .registrationId(donor.getRegistrationId())
                            .age(donor.getAge())
                            .fullName(donor.getFullName())
                            .phoneNumber(donor.getPhoneNumber())
                            .build();
                }).toList();

        return ApiResponse.success("Waiting for screening List fetched",waitingForScreeningResponseList);
    }

    public ApiResponse<List<WaitingDonorQueueResponse>> getWaitingForDonation() {
        List<Donor>  donors = donorRepository.findByStatus(DonorStatus.SCREENED);

        List<WaitingDonorQueueResponse> waitingDonorQueueResponseList = donors.stream()
                .map((donor)->{
                    return WaitingDonorQueueResponse.builder()
                            .registrationId(donor.getRegistrationId())
                            .age(donor.getAge())
                            .fullName(donor.getFullName())
                            .phoneNumber(donor.getPhoneNumber())
                            .build();
                }).toList();

        return ApiResponse.success("Waiting for donation List Fetched",waitingDonorQueueResponseList);
    }

}
