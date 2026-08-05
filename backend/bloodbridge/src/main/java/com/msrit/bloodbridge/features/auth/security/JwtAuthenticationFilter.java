package com.msrit.bloodbridge.features.auth.security;

import com.msrit.bloodbridge.features.auth.jwt.JwtService;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final VolunteerRepository volunteerRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        String usn = jwtService.extractUsn(jwt);

        Volunteer volunteer = volunteerRepository.findByUsn(usn)
                        .orElseThrow(()-> new RuntimeException("Volunteer not found"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(volunteer,null,null);
        SecurityContextHolder.getContext().setAuthentication(authentication);


        filterChain.doFilter(request, response);
    }
}