package com.msrit.bloodbridge.features.volunteer.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.volunteer.dto.request.CreateVolunteerRequest;
import com.msrit.bloodbridge.features.volunteer.dto.response.VolunteerResponse;
import com.msrit.bloodbridge.features.volunteer.service.VolunteerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Volunteer", description = "Volunteer Management")
@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
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

    @PatchMapping("/{id}/activate")
    public ApiResponse<VolunteerResponse> activateVolunteer(@PathVariable Long id) {
        return volunteerService.activateVolunteer(id);
    }

}
