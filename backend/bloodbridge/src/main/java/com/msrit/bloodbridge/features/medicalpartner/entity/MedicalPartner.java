package com.msrit.bloodbridge.features.medicalpartner.entity;

public class MedicalPartner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactPerson;

    @Column(length = 10)
    private String contactNumber;

    @Column(unique = true)
    private String email;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicalPartnerStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id", nullable = false)
    private Camp camp;

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
