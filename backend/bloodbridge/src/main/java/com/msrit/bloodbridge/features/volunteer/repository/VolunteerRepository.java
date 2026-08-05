package com.msrit.bloodbridge.features.volunteer.repository;

import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    Optional<Volunteer> findByUsn(String usn);
    Optional<Volunteer> findByEmail(String email);
}
