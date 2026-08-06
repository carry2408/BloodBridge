package com.msrit.bloodbridge.features.camp.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.camp.dto.request.CreateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.request.UpdateCampRequest;
import com.msrit.bloodbridge.features.camp.dto.response.CampResponse;
import com.msrit.bloodbridge.features.camp.service.CampService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Camp", description = "Blood Donation Camp Management")
@RestController
@RequestMapping("/api/v1/camps")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
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
