package com.msrit.bloodbridge.features.camp.repository;

import com.msrit.bloodbridge.common.enums.CampStatus;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampRepository extends JpaRepository<Camp, Long> {

    Optional<Camp> findFirstByStatus(CampStatus status);
}
