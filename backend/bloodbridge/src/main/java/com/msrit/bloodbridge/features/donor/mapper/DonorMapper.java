package com.msrit.bloodbridge.features.donor.mapper;

import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.donor.dto.request.CreateDonorRequest;
import com.msrit.bloodbridge.features.donor.dto.request.ScreenDonorRequest;
import com.msrit.bloodbridge.features.donor.dto.response.DonorResponse;
import com.msrit.bloodbridge.features.donor.entity.Donor;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;

import java.util.List;

public class DonorMapper {

    private DonorMapper() {
    }

    public static Donor toEntity(CreateDonorRequest request, Camp camp) {

        return Donor.builder()
                .fullName(request.getFullName())
                .age(request.getAge())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .status(DonorStatus.REGISTERED)
                .camp(camp)
                .build();
    }

    public static DonorResponse toResponse(Donor donor) {

        return DonorResponse.builder()
                .id(donor.getId())
                .registrationId(donor.getRegistrationId())
                .fullName(donor.getFullName())
                .age(donor.getAge())
                .gender(donor.getGender())
                .phoneNumber(donor.getPhoneNumber())
                .email(donor.getEmail())
                .bloodGroup(donor.getBloodGroup())
                .weight(donor.getWeight())
                .remarks(donor.getRemarks())
                .status(donor.getStatus())
                .volunteerId(
                        donor.getVolunteer() != null
                                ? donor.getVolunteer().getId()
                                : null
                )
                .createdAt(donor.getCreatedAt())
                .updatedAt(donor.getUpdatedAt())
                .build();
    }

    public static List<DonorResponse> toResponseList(List<Donor> donors) {

        return donors.stream()
                .map(DonorMapper::toResponse)
                .toList();
    }

    public static void updateEntity(Donor donor, CreateDonorRequest request) {

        donor.setFullName(request.getFullName());
        donor.setAge(request.getAge());
        donor.setGender(request.getGender());
        donor.setPhoneNumber(request.getPhoneNumber());
        donor.setEmail(request.getEmail());

    }

    public static void screenDonor(Donor donor,ScreenDonorRequest request,Volunteer volunteer) {

        donor.setBloodGroup(request.getBloodGroup());
        donor.setWeight(request.getWeight());
        donor.setRemarks(request.getRemarks());
        donor.setVolunteer(volunteer);
        donor.setStatus(request.getStatus());

    }
}