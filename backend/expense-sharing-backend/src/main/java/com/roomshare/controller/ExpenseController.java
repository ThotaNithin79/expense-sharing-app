package com.roomshare.controller;

import com.roomshare.dto.*;
import com.roomshare.entity.User;
import com.roomshare.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // ===== THE RETURN TYPE of this endpoint has been updated =====
    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense( // Changed from ResponseEntity<Expense>
                                                       @RequestPart("expense") ExpenseRequest request,
                                                       @RequestPart(value = "proofFile", required = false) MultipartFile proofFile,
                                                       @AuthenticationPrincipal User currentUser
    ) {
        // The service now returns the correct, safe DTO.
        ExpenseResponse newExpenseResponse = expenseService.addExpense(request, proofFile, currentUser);
        return ResponseEntity.ok(newExpenseResponse);
    }


    // ===== ALL GET ENDPOINTS are already correct and do not need changes =====

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(expenseService.getExpensesByGroup(groupId));
    }

    @GetMapping("/group/{groupId}/balances")
    public ResponseEntity<List<BalanceResponse>> getGroupBalances(@PathVariable Long groupId) {
        return ResponseEntity.ok(expenseService.getGroupBalances(groupId));
    }

    @GetMapping("/group/{groupId}/summary")
    public ResponseEntity<MonthlySummaryDto> getMonthlySummary(
            @PathVariable Long groupId,
            @RequestParam String month
    ) {
        return ResponseEntity.ok(expenseService.getMonthlySummary(groupId, month));
    }
}