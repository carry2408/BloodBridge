package com.msrit.bloodbridge.features.donor.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.donor.dto.request.CreateDonorRequest;
import com.msrit.bloodbridge.features.donor.dto.request.ScreenDonorRequest;
import com.msrit.bloodbridge.features.donor.dto.response.DonorResponse;
import com.msrit.bloodbridge.features.donor.service.DonorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Donor", description = "Donor Registration & Donation")
@RestController
@RequestMapping("/api/v1/donors")
@RequiredArgsConstructor
public class DonorController {
    private final DonorService donorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DonorResponse> createDonor(@Valid @RequestBody CreateDonorRequest createDonorRequest) {
        return donorService.createDonor(createDonorRequest);
    }

    @GetMapping("/registration/{registrationId}")
    public ApiResponse<DonorResponse> getDonorByRegistrationId(@PathVariable String registrationId) {
        return donorService.getDonorByRegId(registrationId);
    }

    @PatchMapping("/registration/{registrationId}/screening")
    public ApiResponse<DonorResponse> screenDonor(@PathVariable String registrationId, @Valid @RequestBody ScreenDonorRequest request) {

        return donorService.screenDonorByRegId(registrationId, request);
    }

    @PatchMapping("/registration/{registrationId}/donate")
    public ApiResponse<DonorResponse> donate(@PathVariable String registrationId) {

        return donorService.donate(registrationId);
    }
    
}
