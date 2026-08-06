package com.msrit.bloodbridge.features.auth.service;

import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.features.auth.dto.request.VolunteerLoginRequest;
import com.msrit.bloodbridge.features.auth.dto.response.VolunteerLoginResponse;
import com.msrit.bloodbridge.features.auth.jwt.JwtService;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final VolunteerRepository volunteerRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public VolunteerLoginResponse login(VolunteerLoginRequest request) {

        // Let Spring Security authenticate the volunteer
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsn(),
                        request.getPassword()
                )
        );

        // Fetch volunteer details after successful authentication
        Volunteer volunteer = volunteerRepository
                .findByUsn(request.getUsn())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Volunteer not found"));

        // Generate JWT
        String token = jwtService.generateToken(volunteer.getUsn());

        // Return response
        return VolunteerLoginResponse.builder()
                .token(token)
                .usn(volunteer.getUsn())
                .volunteerName(volunteer.getFullName())
                .build();
    }
}