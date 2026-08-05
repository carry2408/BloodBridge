package com.msrit.bloodbridge.features.auth.controller;

import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.auth.dto.request.VolunteerLoginRequest;
import com.msrit.bloodbridge.features.auth.dto.response.VolunteerLoginResponse;
import com.msrit.bloodbridge.features.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/volunteer/login")
    public ApiResponse<VolunteerLoginResponse> login(@Valid @RequestBody VolunteerLoginRequest volunteerLoginRequest){
        VolunteerLoginResponse response = authService.login(volunteerLoginRequest);

        return ApiResponse.success("Volunteer login success", response);
    }
}
