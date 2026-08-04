package com.msrit.bloodbridge.features.volunteer.repository;

import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
}
