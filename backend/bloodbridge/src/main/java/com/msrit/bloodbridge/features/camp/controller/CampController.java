package com.msrit.bloodbridge.features.camp.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.camp.dto.request.CreateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.request.UpdateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.response.CampResponse;
import com.msrit.bloodbridge.features.camp.service.CampService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/camps")
@RequiredArgsConstructor
public class CampController {
    private final CampService campService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CampResponse> createCamp(@Valid @RequestBody CreateCampRequest request){
        return campService.createCamp(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.FOUND)
    public ApiResponse<List<CampResponse>> getAllCamps(){
        return campService.getAllCamps();
    }

    @GetMapping("/{id}")
    public ApiResponse<CampResponse> getCampById(@PathVariable Long id){
        return campService.getCampById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<CampResponse> updateCamp(@PathVariable Long id, @Valid @RequestBody UpdateCampRequest request){
        return campService.updateCampById(id, request);
    }

    @PatchMapping("/{id}/archive")
    public ApiResponse<CampResponse> archiveCamp(@PathVariable Long id){
        return campService.archiveCampById(id);
    }

}
