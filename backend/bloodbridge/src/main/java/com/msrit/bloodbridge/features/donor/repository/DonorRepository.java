package com.msrit.bloodbridge.features.donor.repository;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.features.donor.entity.Donor;
import com.msrit.bloodbridge.features.reports.dto.response.BloodGroupReportResponse;
import com.msrit.bloodbridge.features.reports.dto.response.MedicalPartnerReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByRegistrationId(String registrationId);

    long countByStatus(DonorStatus status);

    List<Donor> findByStatus(DonorStatus status);

    @Query("""
        SELECT new com.msrit.bloodbridge.features.reports.dto.response.BloodGroupReportResponse(
            d.bloodGroup,
            COUNT(d)
        )
        FROM Donor d
        WHERE d.status = com.msrit.bloodbridge.common.enums.DonorStatus.DONATED
        GROUP BY d.bloodGroup
        ORDER BY COUNT(d) DESC
    """)
    List<BloodGroupReportResponse> getBloodGroupReport();

    @Query("""
SELECT new com.msrit.bloodbridge.features.reports.dto.response.MedicalPartnerReportResponse(
    d.volunteer.team.medicalPartner.name,
    COUNT(d)
)
FROM Donor d
WHERE d.status = com.msrit.bloodbridge.common.enums.DonorStatus.DONATED
GROUP BY d.volunteer.team.medicalPartner.name
ORDER BY COUNT(d) DESC
""")
    List<MedicalPartnerReportResponse> getMedicalPartnerReport();
}