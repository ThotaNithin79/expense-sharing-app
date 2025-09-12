package com.roomshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {
    private Long userId;
    private String name;
    private BigDecimal balance; // Positive means they are owed money, negative means they owe money
}