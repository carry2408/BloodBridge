package com.msrit.bloodbridge.features.team.service;

import com.msrit.bloodbridge.common.enums.TeamStatus;
import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.medicalpartner.entity.MedicalPartner;
import com.msrit.bloodbridge.features.medicalpartner.repository.MedicalPartnerRepository;
import com.msrit.bloodbridge.features.team.dto.request.CreateTeamRequest;
import com.msrit.bloodbridge.features.team.dto.response.TeamResponse;
import com.msrit.bloodbridge.features.team.entity.Team;
import com.msrit.bloodbridge.features.team.mapper.TeamMapper;
import com.msrit.bloodbridge.features.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final MedicalPartnerRepository medicalPartnerRepository;

    public ApiResponse<TeamResponse> createTeam(CreateTeamRequest request) {

        MedicalPartner partner = medicalPartnerRepository.findById(request.getMedicalPartnerId())
                .orElseThrow(()-> new ResourceNotFoundException("Medical Partner Not Found"));

        Team team = TeamMapper.toEntity(request,partner);
        team.setTeamCode("Temp");
        Team savedTeam = teamRepository.save(team);

        savedTeam.setTeamCode(generateTeamCode(savedTeam.getId()));
        savedTeam = teamRepository.save(savedTeam);

        TeamResponse teamResponse = TeamMapper.toResponse(savedTeam);

        return ApiResponse.success("Team created successfully", teamResponse);
    }

    private String generateTeamCode(Long id){
        return String.format("TEAM-%04d",id);
    }

    public ApiResponse<List<TeamResponse>> getAllTeams(){
        List<Team> teams = teamRepository.findAll();
        List<TeamResponse> teamResponseList = teams.stream()
                .map(TeamMapper::toResponse).toList();

        return ApiResponse.success("Teams found",teamResponseList);
    }

    public ApiResponse<TeamResponse> getTeamById(Long id){
        Team team = teamRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Team Not Found"));
        TeamResponse teamResponse = TeamMapper.toResponse(team);
        return ApiResponse.success("Team found",teamResponse);
    }

    public ApiResponse<TeamResponse> updateTeam(Long id, CreateTeamRequest request) {
        Team team =  teamRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Team Not Found"));

        TeamMapper.updateEntity(team,request);
        Team updatedTeam = teamRepository.save(team);
        TeamResponse teamResponse = TeamMapper.toResponse(updatedTeam);
        return ApiResponse.success("Team updated successfully", teamResponse);
    }

    public ApiResponse<TeamResponse> deactivateTeamById(Long id) {
        Team team =  teamRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Team Not Found"));
        team.setStatus(TeamStatus.INACTIVE);
        Team updatedTeam = teamRepository.save(team);
        TeamResponse teamResponse = TeamMapper.toResponse(updatedTeam);
        return ApiResponse.success("Team deactivated successfully", teamResponse);
    }
}
