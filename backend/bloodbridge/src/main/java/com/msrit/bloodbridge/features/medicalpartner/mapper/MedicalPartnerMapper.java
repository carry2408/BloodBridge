package com.msrit.bloodbridge.features.medicalpartner.mapper;

import com.msrit.bloodbridge.common.enums.MedicalPartnerStatus;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.medicalpartner.dto.request.CreateMedicalPartnerRequest;
import com.msrit.bloodbridge.features.medicalpartner.dto.response.MedicalPartnerResponse;
import com.msrit.bloodbridge.features.medicalpartner.entity.MedicalPartner;

public class MedicalPartnerMapper {
    private MedicalPartnerMapper() {}

    public static MedicalPartner toEntity(CreateMedicalPartnerRequest request, Camp camp) {
        return MedicalPartner.builder()
                .name(request.getName())
                .contactPerson(request.getContactPerson())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .status(MedicalPartnerStatus.ACTIVE)
                .camp(camp)
                .build();
    }

    public static MedicalPartnerResponse toResponse(MedicalPartner partner) {
        return MedicalPartnerResponse.builder()
                .id(partner.getId())
                .name(partner.getName())
                .contactPerson(partner.getContactPerson())
                .contactNumber(partner.getContactNumber())
                .email(partner.getEmail())
                .address(partner.getAddress())
                .status(partner.getStatus())
                .campId(partner.getCamp().getId())
                .createdAt(partner.getCreatedAt())
                .updatedAt(partner.getUpdatedAt())
                .build();
    }

    public static void updateEntity(MedicalPartner partner, CreateMedicalPartnerRequest request){
        partner.setName(request.getName());
        partner.setContactPerson(request.getContactPerson());
        partner.setContactNumber(request.getContactNumber());
        partner.setEmail(request.getEmail());
        partner.setAddress(request.getAddress());
        
    }

}
