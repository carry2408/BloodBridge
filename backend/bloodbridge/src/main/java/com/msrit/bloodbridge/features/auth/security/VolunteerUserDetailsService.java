package com.msrit.bloodbridge.features.auth.security;

import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VolunteerUserDetailsService implements UserDetailsService {

    private final VolunteerRepository volunteerRepository;

    @Override
    public UserDetails loadUserByUsername(String usn)
            throws UsernameNotFoundException {

        return volunteerRepository.findByUsn(usn)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Volunteer not found"));
    }
}
