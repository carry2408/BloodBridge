package com.msrit.bloodbridge.features.donor.repository;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.features.donor.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByRegistrationId(String registrationId);

    long countByStatus(DonorStatus status);
    List<Donor> findByStatus(DonorStatus status);
}
