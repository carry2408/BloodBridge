package com.msrit.bloodbridge.features.admin.controller;


import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.admin.service.AdminAuthService;
import com.msrit.bloodbridge.features.auth.dto.request.AdminLoginRequest;
import com.msrit.bloodbridge.features.auth.dto.response.AdminLoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @GetMapping("/password")
    public String password() {
        return new BCryptPasswordEncoder().encode("admin123");
    }

    @PostMapping("/login")
    public ApiResponse<AdminLoginResponse> login(
            @Valid @RequestBody AdminLoginRequest request) {

        return ApiResponse.success(
                "Admin login successful",
                adminAuthService.login(request)
        );
    }
}