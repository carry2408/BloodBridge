package com.msrit.bloodbridge.features.auth.service;

import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.features.auth.dto.request.VolunteerLoginRequest;
import com.msrit.bloodbridge.features.auth.dto.response.VolunteerLoginResponse;
import com.msrit.bloodbridge.features.auth.jwt.JwtService;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final VolunteerRepository volunteerRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public VolunteerLoginResponse login(VolunteerLoginRequest request) {

        Volunteer volunteer = volunteerRepository
                .findByUsn(request.getUsn())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid Usn number"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                volunteer.getPassword())) {

            throw new IllegalArgumentException("Invalid password");
        }

        return VolunteerLoginResponse.builder()
                .token(jwtService.generateToken(volunteer.getUsn()))
                .usn(volunteer.getUsn())
                .volunteerName(volunteer.getFullName())
                .build();
    }
}