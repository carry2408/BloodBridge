package com.msrit.bloodbridge.features.volunteer.service;

import com.msrit.bloodbridge.common.enums.VolunteerStatus;
import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.team.entity.Team;
import com.msrit.bloodbridge.features.team.repository.TeamRepository;
import com.msrit.bloodbridge.features.volunteer.dto.request.CreateVolunteerRequest;
import com.msrit.bloodbridge.features.volunteer.dto.response.VolunteerResponse;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import com.msrit.bloodbridge.features.volunteer.mapper.VolunteerMapper;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerService {
    private final VolunteerRepository volunteerRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse<VolunteerResponse> createVolunteer(CreateVolunteerRequest createVolunteerRequest) {
        Team team = teamRepository.findById(createVolunteerRequest.getTeamId())
                .orElseThrow(()-> new ResourceNotFoundException("Team not found"));
        Volunteer volunteer = VolunteerMapper.toEntity(createVolunteerRequest,team);
        volunteer.setPassword("Temp");
        Volunteer savedVolunteer = volunteerRepository.save(volunteer);
        String generatedPassword = String.format("BB@%04d", savedVolunteer.getId());
        savedVolunteer.setPassword(passwordEncoder.encode(generatedPassword));
        savedVolunteer = volunteerRepository.save(savedVolunteer);
        VolunteerResponse response = VolunteerMapper.toResponse(savedVolunteer);
        response.setGeneratedPassword(generatedPassword);
        return ApiResponse.success("Volunteer created successfully", response);
    }

    public ApiResponse<List<VolunteerResponse>> getAllVolunteers() {
        List<Volunteer> volunteers = volunteerRepository.findAll();
        List<VolunteerResponse> responseList = new ArrayList<>();

    responseList = volunteers.stream()
                .map(VolunteerMapper::toResponse).toList();

    return ApiResponse.success("Volunteers retrieved successfully", responseList);
    }

    public ApiResponse<VolunteerResponse> getVolunteerById(Long id) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));
        VolunteerResponse response = VolunteerMapper.toResponse(volunteer);
        return ApiResponse.success("Volunteer retrieved successfully", response);
    }

    public ApiResponse<VolunteerResponse> updateVolunteer(Long id, CreateVolunteerRequest createVolunteerRequest) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        VolunteerMapper.updateEntity(volunteer,createVolunteerRequest);
        Volunteer updatedVolunteer = volunteerRepository.save(volunteer);
        VolunteerResponse response = VolunteerMapper.toResponse(updatedVolunteer);
        return ApiResponse.success("Volunteer updated successfully", response);
    }

    public ApiResponse<VolunteerResponse> deactivateVolunteer(Long id) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        volunteer.setStatus(VolunteerStatus.INACTIVE);
        volunteerRepository.save(volunteer);
        VolunteerResponse response = VolunteerMapper.toResponse(volunteer);
        return ApiResponse.success("Volunteer with Id:"+id+" deactivated",response);
    }
}
