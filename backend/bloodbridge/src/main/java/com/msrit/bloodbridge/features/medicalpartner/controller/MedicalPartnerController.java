package com.msrit.bloodbridge.features.medicalpartner.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.medicalpartner.dto.request.CreateMedicalPartnerRequest;
import com.msrit.bloodbridge.features.medicalpartner.dto.response.MedicalPartnerResponse;
import com.msrit.bloodbridge.features.medicalpartner.service.MedicalPartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-partners")
@RequiredArgsConstructor
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
    @ResponseStatus(HttpStatus.FOUND)
    public ApiResponse<MedicalPartnerResponse> getMedicalPartnerById(@PathVariable Long id){
        return medicalPartnerService.getMedicalPartnerById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<MedicalPartnerResponse> updateMedicalPartner(@PathVariable Long id,@RequestBody CreateMedicalPartnerRequest request ){
        return medicalPartnerService.updateMedicalPartnerById(id,request);
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<MedicalPartnerResponse> deactivateMedicalPartner(@PathVariable Long id){
        return medicalPartnerService.deactivateMedicalPartnerById(id);
    }
}
