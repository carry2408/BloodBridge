package com.msrit.bloodbridge.features.camp.service;

import com.msrit.bloodbridge.common.enums.CampStatus;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.camp.dto.request.CreateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.request.UpdateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.response.CampResponse;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.camp.mapper.CampMapper;
import com.msrit.bloodbridge.features.camp.repository.CampRepository;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.util.List;

@Service

public class CampService {
    private final CampRepository campRepository;
    public CampService(CampRepository campRepository) {
        this.campRepository = campRepository;

    }

    // post api for creating camp
    public ApiResponse<CampResponse> createCamp(CreateCampRequest request) {
        Camp camp = CampMapper.toEntity(request);

        Camp savedCamp = campRepository.save(camp);

        CampResponse response =  CampMapper.toResponse(savedCamp);


        return ApiResponse.<CampResponse>builder()
                .success(true)
                .message("Camp created successfully")
                .data(response)
                .build();
        }

    // get api for getting all camps
    public ApiResponse<List<CampResponse>> getAllCamps() {
        List<Camp> camps = campRepository.findAll();
        List<CampResponse> campResponseList = CampMapper.toResponseList(camps);

        return ApiResponse.<List<CampResponse>>builder()
                .success(true)
                .message("Camps fetched successfully")
                .data(campResponseList)
                .build();
    }

    // get api for getting camp details using id
    public ApiResponse<CampResponse> getCampById(Long id) {
        Camp camp = campRepository.findById(id)
                .orElseThrow(()-> new ResolutionException("Camp not found"));
        CampResponse response =  CampMapper.toResponse(camp);

        return ApiResponse.<CampResponse>builder()
                .success(true)
                .message("Camp fetched successfully")
                .data(response)
                .build();
    }

    // updating the whole camp entity method
    public ApiResponse<CampResponse> updateCampById(Long id, UpdateCampRequest request) {
        Camp camp = campRepository.findById(id)
                .orElseThrow(()-> new ResolutionException("Camp not found"));

        CampMapper.updateEntity(camp, request);
        Camp updatedCamp = campRepository.save(camp);
        CampResponse response =  CampMapper.toResponse(updatedCamp);

        return ApiResponse.<CampResponse>builder()
                .success(true)
                .message("Camp updated successfully")
                .data(response)
                .build();
    }

    // method for archiving camp instead of deleting the camp
    public  ApiResponse<CampResponse> archiveCampById(Long id) {
        Camp camp = campRepository.findById(id)
                .orElseThrow(()-> new ResolutionException("Camp not found"));

        camp.setStatus(CampStatus.ARCHIVED);
        Camp updatedCamp = campRepository.save(camp);

        CampResponse response =  CampMapper.toResponse(updatedCamp);

        return ApiResponse.<CampResponse>builder()
                .success(true)
                .message("Camp archived successfully")
                .data(response)
                .build();
    }

}
