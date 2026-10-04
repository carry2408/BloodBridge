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

        Long teamId = null;
        String teamName = null;
        String teamCode = null;
        if (donor.getTeam() != null) {
            teamId = donor.getTeam().getId();
            teamName = donor.getTeam().getTeamName();
            teamCode = donor.getTeam().getTeamCode();
        } else if (donor.getVolunteer() != null && donor.getVolunteer().getTeam() != null) {
            teamId = donor.getVolunteer().getTeam().getId();
            teamName = donor.getVolunteer().getTeam().getTeamName();
            teamCode = donor.getVolunteer().getTeam().getTeamCode();
        }

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
                .unitsDonated(donor.getUnitsDonated())
                .bloodPressure(donor.getBloodPressure())
                .sugarLevel(donor.getSugarLevel())
                .hemoglobin(donor.getHemoglobin())
                .remarks(donor.getRemarks())
                .status(donor.getStatus())
                .volunteerId(
                        donor.getVolunteer() != null
                                ? donor.getVolunteer().getId()
                                : null
                )
                .volunteerName(
                        donor.getVolunteer() != null
                                ? donor.getVolunteer().getFullName()
                                : null
                )
                .teamId(teamId)
                .teamName(teamName)
                .teamCode(teamCode)
                .campId(
                        donor.getCamp() != null
                                ? donor.getCamp().getId()
                                : null
                )
                .campName(
                        donor.getCamp() != null
                                ? donor.getCamp().getCampName()
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

    public static void screenDonor(Donor donor, ScreenDonorRequest request, Volunteer volunteer, com.msrit.bloodbridge.features.team.entity.Team team) {

        donor.setBloodGroup(request.getBloodGroup());
        donor.setWeight(request.getWeight());
        if (request.getUnitsDonated() != null) donor.setUnitsDonated(request.getUnitsDonated());
        if (request.getBloodPressure() != null) donor.setBloodPressure(request.getBloodPressure());
        if (request.getSugarLevel() != null) donor.setSugarLevel(request.getSugarLevel());
        if (request.getHemoglobin() != null) donor.setHemoglobin(request.getHemoglobin());
        donor.setRemarks(request.getRemarks());
        donor.setVolunteer(volunteer);
        if (team != null) {
            donor.setTeam(team);
        } else if (volunteer != null && volunteer.getTeam() != null) {
            donor.setTeam(volunteer.getTeam());
        }
        donor.setStatus(request.getStatus());

    }
}