package com.msrit.bloodbridge.features.volunteer.mapper;

import com.msrit.bloodbridge.common.enums.VolunteerStatus;
import com.msrit.bloodbridge.features.team.entity.Team;
import com.msrit.bloodbridge.features.volunteer.dto.request.CreateVolunteerRequest;
import com.msrit.bloodbridge.features.volunteer.dto.response.VolunteerResponse;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;

import java.util.List;

public class VolunteerMapper {

    private VolunteerMapper() {
    }

    public static Volunteer toEntity(CreateVolunteerRequest request, Team team) {

        return Volunteer.builder()
                .fullName(request.getFullName())
                .usn(request.getUsn())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .status(VolunteerStatus.ACTIVE)
                .team(team)
                .build();
    }

    public static VolunteerResponse toResponse(Volunteer volunteer) {

        String teamName = (volunteer.getTeam() != null) ? volunteer.getTeam().getTeamName() : null;
        String teamCode = (volunteer.getTeam() != null) ? volunteer.getTeam().getTeamCode() : null;
        Long teamId = (volunteer.getTeam() != null) ? volunteer.getTeam().getId() : null;

        String pwd = (volunteer.getId() != null) ? String.format("BB@%04d", volunteer.getId()) : "BB@0001";

        return VolunteerResponse.builder()
                .id(volunteer.getId())
                .fullName(volunteer.getFullName())
                .usn(volunteer.getUsn())
                .phoneNumber(volunteer.getPhoneNumber())
                .email(volunteer.getEmail())
                .status(volunteer.getStatus())
                .teamId(teamId)
                .teamCode(teamCode)
                .teamName(teamName)
                .generatedPassword(pwd)
                .createdAt(volunteer.getCreatedAt())
                .updatedAt(volunteer.getUpdatedAt())
                .build();
    }

    public static List<VolunteerResponse> toResponseList(List<Volunteer> volunteers) {
        return volunteers.stream()
                .map(VolunteerMapper::toResponse)
                .toList();
    }

    public static void updateEntity(Volunteer volunteer, CreateVolunteerRequest request, Team team) {

        volunteer.setFullName(request.getFullName());
        volunteer.setUsn(request.getUsn());
        volunteer.setPhoneNumber(request.getPhoneNumber());
        volunteer.setEmail(request.getEmail());
        if (team != null) {
            volunteer.setTeam(team);
        }
    }
}