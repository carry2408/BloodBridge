package com.msrit.bloodbridge.features.camp.mapper;

import com.msrit.bloodbridge.common.enums.CampStatus;
import com.msrit.bloodbridge.features.camp.dto.request.CreateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.request.UpdateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.response.CampResponse;
import com.msrit.bloodbridge.features.camp.entity.Camp;

import java.util.ArrayList;
import java.util.List;

public class CampMapper {
    private CampMapper(){}

    public static Camp toEntity(CreateCampRequest request){
        return Camp.builder()
                .campName(request.getCampName())
                .description(request.getDescription())
                .venue(request.getVenue())
                .campDate(request.getCampDate())
                .registrationStart(request.getRegistrationStart())
                .registrationEnd(request.getRegistrationEnd())
                .status(CampStatus.UPCOMING)
                .build();
    }

    public static CampResponse toResponse(Camp camp) {
        return CampResponse.builder()
                .id(camp.getId())
                .campName(camp.getCampName())
                .description(camp.getDescription())
                .venue(camp.getVenue())
                .campDate(camp.getCampDate())
                .registrationStart(camp.getRegistrationStart())
                .registrationEnd(camp.getRegistrationEnd())
                .status(camp.getStatus())
                .createdAt(camp.getCreatedAt())
                .updatedAt(camp.getUpdatedAt())
                .build();
    }


    public static List<CampResponse> toResponseList(List<Camp> camps) {
        List<CampResponse> responses = new ArrayList<>();

        for (Camp camp : camps) {
            responses.add(CampMapper.toResponse(camp));
        }

        return responses;
    }

    public static void updateEntity(Camp camp , UpdateCampRequest request){
        camp.setCampName(request.getCampName());
        camp.setDescription(request.getDescription());
        camp.setVenue(request.getVenue());
        camp.setCampDate(request.getCampDate());
        camp.setRegistrationStart(request.getRegistrationStart());
        camp.setRegistrationEnd(request.getRegistrationEnd());
        if (request.getStatus() != null) {
            camp.setStatus(request.getStatus());
        }
    }


}
