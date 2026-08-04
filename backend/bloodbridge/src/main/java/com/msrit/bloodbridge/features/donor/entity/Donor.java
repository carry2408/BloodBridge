package com.msrit.bloodbridge.features.donor.entity;

import com.msrit.bloodbridge.common.enums.BloodGroup;
import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.enums.Gender;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "donor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false, length = 10)
    private String phoneNumber;

    private String email;

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    private Double weight;

    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonorStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id", nullable = false)
    private Camp camp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}