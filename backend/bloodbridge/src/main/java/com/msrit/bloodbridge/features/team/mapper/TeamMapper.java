package com.msrit.bloodbridge.features.team.mapper;

import com.msrit.bloodbridge.common.enums.TeamStatus;
import com.msrit.bloodbridge.features.medicalpartner.entity.MedicalPartner;
import com.msrit.bloodbridge.features.team.dto.request.CreateTeamRequest;
import com.msrit.bloodbridge.features.team.dto.response.TeamResponse;
import com.msrit.bloodbridge.features.team.entity.Team;

import java.util.List;

public class TeamMapper {
        private TeamMapper(){}

    public static Team toEntity(CreateTeamRequest request, MedicalPartner partner){
       return Team.builder()
               .teamName(request.getTeamName())
               .description(request.getDescription())
               .status(TeamStatus.ACTIVE)
               .medicalPartner(partner)
               .build();
    }

    public static TeamResponse toResponse(Team team){
            return TeamResponse.builder()
                    .id(team.getId())
                    .teamName(team.getTeamName())
                    .teamCode(team.getTeamCode())
                    .description(team.getDescription())
                    .status(team.getStatus())
                    .medicalPartnerId(team.getMedicalPartner().getId())
                    .createdAt(team.getCreatedAt())
                    .updatedAt(team.getUpdatedAt())
                    .build();
    }

    public static List<TeamResponse> toResponseList(List<Team> teams){
            return teams.stream().map(
                    TeamMapper::toResponse
            ).toList();
    }

    public static void updateEntity(Team team, CreateTeamRequest request){
            team.setTeamName(request.getTeamName());
            team.setDescription(request.getDescription());
    }


}
