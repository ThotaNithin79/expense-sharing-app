package com.roomshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDto {
    private BigDecimal totalSpent;
    private List<MemberContributionDto> members;
}