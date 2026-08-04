package com.msrit.bloodbridge.features.dashboard.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.dashboard.dto.response.DashboardSummaryResponse;
import com.msrit.bloodbridge.features.dashboard.dto.response.WaitingDonorQueueResponse;
import com.msrit.bloodbridge.features.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> getSummary(){
        return dashboardService.getSummary();
    }

    @GetMapping("/waiting-for-screening")
    public ApiResponse<List<WaitingDonorQueueResponse>> getWaitingForScreening(){
        return dashboardService.getWaitingForScreening();
    }

    @GetMapping("/waiting-for-donation")
    public ApiResponse<List<WaitingDonorQueueResponse>> getWaitingForDonation(){
        return dashboardService.getWaitingForDonation();
    }

}
