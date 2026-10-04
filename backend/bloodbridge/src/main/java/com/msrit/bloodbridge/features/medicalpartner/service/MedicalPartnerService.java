package com.msrit.bloodbridge.features.medicalpartner.service;

import com.msrit.bloodbridge.common.enums.CampStatus;
import com.msrit.bloodbridge.common.enums.MedicalPartnerStatus;
import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.camp.repository.CampRepository;
import com.msrit.bloodbridge.features.medicalpartner.dto.request.CreateMedicalPartnerRequest;
import com.msrit.bloodbridge.features.medicalpartner.dto.response.MedicalPartnerResponse;
import com.msrit.bloodbridge.features.medicalpartner.entity.MedicalPartner;
import com.msrit.bloodbridge.features.medicalpartner.mapper.MedicalPartnerMapper;
import com.msrit.bloodbridge.features.medicalpartner.repository.MedicalPartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalPartnerService {

    private final MedicalPartnerRepository medicalPartnerRepository;
    private final CampRepository campRepository;

    public ApiResponse<MedicalPartnerResponse> createMedicalPartner(CreateMedicalPartnerRequest request){
        Camp camp = campRepository.findFirstByStatus(CampStatus.ACTIVE)
                .orElseThrow(()-> new ResourceNotFoundException("No active camp"));

        MedicalPartner partner = MedicalPartnerMapper.toEntity(request,camp);
        MedicalPartner savedPartner = medicalPartnerRepository.save(partner);

        MedicalPartnerResponse response = MedicalPartnerMapper.toResponse(savedPartner);

        return ApiResponse.<MedicalPartnerResponse>builder()
                .success(true)
                .message("Medical partner created successfully")
                .data(response)
                .build();
    }

    public ApiResponse<List<MedicalPartnerResponse>> getAllMedicalPartner(){
        List<MedicalPartner> partnerList = medicalPartnerRepository.findAll();
        List<MedicalPartnerResponse> partnerResponseList = new ArrayList<>();
        for (MedicalPartner partner : partnerList){
            partnerResponseList.add(MedicalPartnerMapper.toResponse(partner));
        }

        return ApiResponse.<List<MedicalPartnerResponse>>builder()
                .success(true)
                .message("Medical Partners fetched successfully")
                .data(partnerResponseList)
                .build();
    }

    public ApiResponse<MedicalPartnerResponse> getMedicalPartnerById(Long id){
        MedicalPartner partner = medicalPartnerRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Medical partner with id " + id + " not found"));

        MedicalPartnerResponse response = MedicalPartnerMapper.toResponse(partner);

        // created a new apirespone.success method for doing same thing
        return ApiResponse.success("Medical partner with Id:"+id+" fetched successfully", response);
    }

    public ApiResponse<MedicalPartnerResponse> updateMedicalPartnerById(Long id, CreateMedicalPartnerRequest request){
        MedicalPartner partner = medicalPartnerRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Medical partner not found"));

        MedicalPartnerMapper.updateEntity(partner,request);

        MedicalPartner savedPartner = medicalPartnerRepository.save(partner);
        MedicalPartnerResponse response = MedicalPartnerMapper.toResponse(savedPartner);

        return ApiResponse.success("Medical partner updated successfully", response);
    }

    public ApiResponse<MedicalPartnerResponse> deactivateMedicalPartnerById(Long id){
        MedicalPartner partner = medicalPartnerRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Medical partner not found"));

        partner.setStatus(MedicalPartnerStatus.INACTIVE);
        MedicalPartner savedPartner = medicalPartnerRepository.save(partner);

        MedicalPartnerResponse response = MedicalPartnerMapper.toResponse(savedPartner);
        return ApiResponse.success("Medical partner deactivated successfully", response);
    }

    public ApiResponse<MedicalPartnerResponse> activateMedicalPartnerById(Long id){
        MedicalPartner partner = medicalPartnerRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Medical partner not found"));

        partner.setStatus(MedicalPartnerStatus.ACTIVE);
        MedicalPartner savedPartner = medicalPartnerRepository.save(partner);

        MedicalPartnerResponse response = MedicalPartnerMapper.toResponse(savedPartner);
        return ApiResponse.success("Medical partner activated successfully", response);
    }

}
