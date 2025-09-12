package com.roomshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberContributionDto {
    private Long userId;
    private String name;
    private BigDecimal contribution;
}