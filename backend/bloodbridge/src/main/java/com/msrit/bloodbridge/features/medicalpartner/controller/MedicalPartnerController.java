package com.msrit.bloodbridge.features.medicalpartner.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.medicalpartner.dto.request.CreateMedicalPartnerRequest;
import com.msrit.bloodbridge.features.medicalpartner.dto.response.MedicalPartnerResponse;
import com.msrit.bloodbridge.features.medicalpartner.service.MedicalPartnerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Medical Partner", description = "Medical Partner Management")
@RestController
@RequestMapping("/api/v1/medical-partners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MedicalPartnerController {
    private final MedicalPartnerService medicalPartnerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MedicalPartnerResponse> createMedicalPartner(@Valid @RequestBody CreateMedicalPartnerRequest request){
        return medicalPartnerService.createMedicalPartner(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<MedicalPartnerResponse>> getAllMedicalPartners(){
        return medicalPartnerService.getAllMedicalPartner();
    }

    @GetMapping("/{id}")
    public ApiResponse<MedicalPartnerResponse> getMedicalPartnerById(@PathVariable Long id){
        return medicalPartnerService.getMedicalPartnerById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<MedicalPartnerResponse> updateMedicalPartner(@PathVariable Long id, @Valid @RequestBody CreateMedicalPartnerRequest request ){
        return medicalPartnerService.updateMedicalPartnerById(id,request);
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<MedicalPartnerResponse> deactivateMedicalPartner(@PathVariable Long id){
        return medicalPartnerService.deactivateMedicalPartnerById(id);
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<MedicalPartnerResponse> activateMedicalPartner(@PathVariable Long id){
        return medicalPartnerService.activateMedicalPartnerById(id);
    }
}

