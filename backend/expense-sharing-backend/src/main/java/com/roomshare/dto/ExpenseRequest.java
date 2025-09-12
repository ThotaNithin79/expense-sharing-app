package com.roomshare.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExpenseRequest {
    private Long groupId;
    private String title;
    private String category;
    private BigDecimal amount;
    // We will handle proofUrl later when we implement file uploads
}