package com.msrit.bloodbridge.features.admin.service;

import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.features.admin.entity.Admin;
import com.msrit.bloodbridge.features.admin.repository.AdminRepository;
import com.msrit.bloodbridge.features.auth.dto.request.AdminLoginRequest;
import com.msrit.bloodbridge.features.auth.dto.response.AdminLoginResponse;
import com.msrit.bloodbridge.features.auth.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminLoginResponse login(AdminLoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Admin not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtService.generateToken(admin.getEmail());

        return AdminLoginResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .adminName(admin.getFullName())
                .build();
    }
}