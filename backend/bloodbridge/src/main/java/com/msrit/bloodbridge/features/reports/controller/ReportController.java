package com.msrit.bloodbridge.features.reports.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.reports.dto.response.BloodGroupReportResponse;
import com.msrit.bloodbridge.features.reports.dto.response.MedicalPartnerReportResponse;
import com.msrit.bloodbridge.features.reports.dto.response.ReportSummaryResponse;
import com.msrit.bloodbridge.features.reports.service.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Reports", description = "System Reports")
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ApiResponse<ReportSummaryResponse> getSummary() {

        return reportService.getSummary();

    }

    @GetMapping("/blood-groups")
    public ApiResponse<List<BloodGroupReportResponse>> getBloodGroupReport() {

        return reportService.getBloodGroupReport();

    }

    @GetMapping("/medical-partners")
    public ApiResponse<List<MedicalPartnerReportResponse>> getMedicalPartnerReport() {

        return reportService.getMedicalPartnerReport();

    }
}