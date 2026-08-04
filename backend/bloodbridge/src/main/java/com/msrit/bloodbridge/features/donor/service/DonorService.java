package com.msrit.bloodbridge.features.donor.service;

import com.msrit.bloodbridge.common.enums.CampStatus;
import com.msrit.bloodbridge.common.enums.DonorStatus;
import com.msrit.bloodbridge.common.exception.ResourceNotFoundException;
import com.msrit.bloodbridge.common.response.ApiResponse;
import com.msrit.bloodbridge.features.camp.entity.Camp;
import com.msrit.bloodbridge.features.camp.repository.CampRepository;
import com.msrit.bloodbridge.features.donor.dto.request.CreateDonorRequest;
import com.msrit.bloodbridge.features.donor.dto.response.DonorResponse;
import com.msrit.bloodbridge.features.donor.entity.Donor;
import com.msrit.bloodbridge.features.donor.mapper.DonorMapper;
import com.msrit.bloodbridge.features.donor.repository.DonorRepository;
import com.msrit.bloodbridge.features.volunteer.entity.Volunteer;
import com.msrit.bloodbridge.features.volunteer.repository.VolunteerRepository;
import com.msrit.bloodbridge.features.donor.dto.request.ScreenDonorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorService {
    private final DonorRepository donorRepository;
    private final CampRepository campRepository;
    private final VolunteerRepository volunteerRepository;

    // to create the donor
    public ApiResponse<DonorResponse> createDonor(CreateDonorRequest createDonorRequest) {
        Camp camp = campRepository.findFirstByStatus(CampStatus.ACTIVE)
                .orElseThrow(()-> new ResourceNotFoundException("no active Camp Found"));
        Donor donor = DonorMapper.toEntity(createDonorRequest, camp);
        donor.setRegistrationId("Temp");
        Donor savedDonor = donorRepository.save(donor);
       String reg = generateRegistrationId(savedDonor.getId());
       savedDonor.setRegistrationId(reg);
       savedDonor = donorRepository.save(savedDonor);

       DonorResponse donorResponse = DonorMapper.toResponse(savedDonor);
       return ApiResponse.success("Donor Created", donorResponse);
    }
    // method for generating registered id
    private String generateRegistrationId(Long id) {

        return String.format("MSRIT-BDC-2026-%04d", id);

    }

    public ApiResponse<List<DonorResponse>> getAllDonors(){
        List<Donor> donors = donorRepository.findAll();
        List<DonorResponse> responseList =DonorMapper.toResponseList(donors);

        return ApiResponse.success("Donors Found", responseList);
    }

    public ApiResponse<DonorResponse> getDonorByRegId(String regId) {
        Donor donor = donorRepository.findByRegistrationId(regId)
                .orElseThrow(()-> new ResourceNotFoundException("donor not found"));
        DonorResponse donorResponse = DonorMapper.toResponse(donor);
        return ApiResponse.success("Donor Found", donorResponse);
    }

    public ApiResponse<DonorResponse> updateDonorById(String regId, CreateDonorRequest createDonorRequest) {
        Donor donor = donorRepository.findByRegistrationId(regId)
                .orElseThrow(()-> new ResourceNotFoundException("donor not found"));

        DonorMapper.updateEntity(donor, createDonorRequest);

        Donor savedDonor = donorRepository.save(donor);
        DonorResponse response = DonorMapper.toResponse(savedDonor);
        return ApiResponse.success("Donor Updated", response);
    }

    public ApiResponse<DonorResponse> screenDonorByRegId(String regId, ScreenDonorRequest request) {
        if (request.getStatus() != DonorStatus.SCREENED
                && request.getStatus() != DonorStatus.REJECTED) {

            throw new IllegalArgumentException(
                    "Status must be SCREENED or REJECTED");
        }
        Donor donor = donorRepository.findByRegistrationId(regId)
                .orElseThrow(()-> new ResourceNotFoundException("donor not found"));
        Volunteer volunteer = volunteerRepository.findById(request.getVolunteerId())
                        .orElseThrow(()-> new ResourceNotFoundException("volunteer not found"));
        DonorMapper.screenDonor(donor,request,volunteer);

        Donor savedDonor = donorRepository.save(donor);
        DonorResponse response = DonorMapper.toResponse(savedDonor);
        return ApiResponse.success("Donor Updated", response);
    }

    public ApiResponse<DonorResponse> donate(String registrationId) {

        Donor donor = donorRepository.findByRegistrationId(registrationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        if (donor.getStatus() != DonorStatus.SCREENED) {
            throw new IllegalStateException(
                    "Only screened donors can donate");
        }

        donor.setStatus(DonorStatus.DONATED);

        Donor updatedDonor = donorRepository.save(donor);

        DonorResponse response = DonorMapper.toResponse(updatedDonor);

        return ApiResponse.<DonorResponse>builder()
                .success(true)
                .message("Donation completed successfully")
                .data(response)
                .build();
    }

}
