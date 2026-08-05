package com.msrit.bloodbridge.features.reports.dto.response;

import com.msrit.bloodbridge.common.enums.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BloodGroupReportResponse {

    private BloodGroup bloodGroup;

    private Long count;
}