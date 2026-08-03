package com.msrit.bloodbridge.features.medicalpartner.repository;

import com.msrit.bloodbridge.features.medicalpartner.entity.MedicalPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalPartnerRepository extends JpaRepository<MedicalPartner, Long> {

}
