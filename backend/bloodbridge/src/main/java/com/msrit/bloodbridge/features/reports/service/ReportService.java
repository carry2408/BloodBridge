package com.msrit.bloodbridge.features.reports.service;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.donor.repository.DonorRepository;
import com.msrit.bloodbridge.features.reports.dto.response.BloodGroupReportResponse;
import com.msrit.bloodbridge.features.reports.dto.response.MedicalPartnerReportResponse;
import com.msrit.bloodbridge.features.reports.dto.response.ReportSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DonorRepository  donorRepository;

    public ApiResponse<ReportSummaryResponse> getSummary(){
     ReportSummaryResponse response=   ReportSummaryResponse.builder()
                .totalRegistered(donorRepository.count())
                .totalScreened(donorRepository.countByStatus(DonorStatus.SCREENED))
                .totalDonated(donorRepository.countByStatus(DonorStatus.DONATED))
                .totalRejected(donorRepository.countByStatus(DonorStatus.REJECTED))
                .build();

        return ApiResponse.success("Report Summary", response);
    }

    public ApiResponse<List<BloodGroupReportResponse>>  getBloodGroupReport(){
        List<BloodGroupReportResponse> bloodGroupReportResponseList = donorRepository.getBloodGroupReport();
        return ApiResponse.success(
                "Blood group report fetched successfully",
                            bloodGroupReportResponseList        );
    }

    public ApiResponse<List<MedicalPartnerReportResponse>> getMedicalPartnerReport(){
        List<MedicalPartnerReportResponse> responseList = donorRepository.getMedicalPartnerReport();
        return ApiResponse.success("Medical partner report fetched successfully", responseList);
    }
}
