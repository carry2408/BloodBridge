package com.msrit.bloodbridge.features.team.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.team.dto.request.CreateTeamRequest;
import com.msrit.bloodbridge.features.team.dto.response.TeamResponse;
import com.msrit.bloodbridge.features.team.service.TeamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Team", description = "Team Management")
@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TeamController {
    private final TeamService teamService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TeamResponse> createTeam(@Valid @RequestBody CreateTeamRequest request){
        return teamService.createTeam(request);
    }

    @GetMapping
    public ApiResponse<List<TeamResponse>> getAllTeams(){
        return teamService.getAllTeams();
    }

    @GetMapping("/{id}")
    public ApiResponse<TeamResponse> getTeamById(@PathVariable Long id){
        return teamService.getTeamById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<TeamResponse> updateTeam(@Valid @RequestBody CreateTeamRequest request, @PathVariable Long id){
        return teamService.updateTeam(id,request);
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<TeamResponse> deactivateTeam(@PathVariable Long id){
        return teamService.deactivateTeamById(id);
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<TeamResponse> activateTeam(@PathVariable Long id){
        return teamService.activateTeamById(id);
    }
}
