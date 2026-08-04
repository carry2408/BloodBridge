package com.msrit.bloodbridge.features.volunteer.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.volunteer.dto.request.CreateVolunteerRequest;
import com.msrit.bloodbridge.features.volunteer.dto.response.VolunteerResponse;
import com.msrit.bloodbridge.features.volunteer.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<VolunteerResponse> createVolunteer(@Valid @RequestBody CreateVolunteerRequest createVolunteerRequest) {
        return volunteerService.createVolunteer(createVolunteerRequest);
    }

    @GetMapping
    public ApiResponse<List<VolunteerResponse>> getAllVolunteers() {
        return volunteerService.getAllVolunteers();
    }

    @GetMapping("/{id}")
    public ApiResponse<VolunteerResponse> getVolunteer(@PathVariable Long id) {
        return volunteerService.getVolunteerById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<VolunteerResponse> updateVolunteer(@PathVariable Long id, @Valid @RequestBody CreateVolunteerRequest createVolunteerRequest) {
        return volunteerService.updateVolunteer(id, createVolunteerRequest);
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<VolunteerResponse> deactivateVolunteer(@PathVariable Long id) {
        return volunteerService.deactivateVolunteer(id);
    }

}
