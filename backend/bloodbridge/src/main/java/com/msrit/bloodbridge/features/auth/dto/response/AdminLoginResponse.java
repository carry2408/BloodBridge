package com.msrit.bloodbridge.features.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminLoginResponse {

    private String token;
    private String email;
    private String adminName;
}