package com.roomshare.service;

import com.roomshare.dto.*;
import com.roomshare.entity.*;
import com.roomshare.exception.ResourceNotFoundException;
import com.roomshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder; // <<< --- IMPORTANT IMPORT
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final FileStorageService fileStorageService;

    // 1. INJECT THE NEW SECURITY SERVICE
    private final SecurityService securityService;


    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request, User addedBy) {
        return this.addExpense(request, null, addedBy);
    }

    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request, MultipartFile proofFile, User addedBy) {
        // 2. ADDED SECURITY CHECK for adding expenses
        securityService.verifyUserIsMemberOfGroup(request.getGroupId(), addedBy);

        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + request.getGroupId()));

        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setAddedBy(addedBy);
        expense.setTitle(request.getTitle());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());

        if (proofFile != null && !proofFile.isEmpty()) {
            String filePath = fileStorageService.storeFile(proofFile);
            expense.setProofUrl(filePath);
        }

        Expense savedExpense = expenseRepository.save(expense);

        List<GroupMember> members = groupMemberRepository.findByGroupId(group.getId());
        if (members.isEmpty()) {
            throw new IllegalStateException("Cannot add expense to an empty group.");
        }
        BigDecimal shareAmount = request.getAmount().divide(
                new BigDecimal(members.size()), 2, RoundingMode.HALF_UP
        );
        for (GroupMember member : members) {
            ExpenseShare share = new ExpenseShare();
            share.setExpense(savedExpense);
            share.setUser(member.getUser());
            share.setShareAmount(shareAmount);
            expenseShareRepository.save(share);
        }

        return new ExpenseResponse(
                savedExpense.getId(),
                savedExpense.getTitle(),
                savedExpense.getAmount(),
                savedExpense.getCategory(),
                savedExpense.getAddedBy().getName(),
                savedExpense.getCreatedAt()
        );
    }

    // ===== THIS METHOD IS NOW SECURED =====
    public List<ExpenseResponse> getExpensesByGroup(Long groupId) {
        // 3. ADDED SECURITY CHECK: Get the current user and verify they are a member of this group
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        securityService.verifyUserIsMemberOfGroup(groupId, currentUser);

        List<Expense> expenses = expenseRepository.findByGroupId(groupId);
        return expenses.stream()
                .map(expense -> new ExpenseResponse(
                        expense.getId(),
                        expense.getTitle(),
                        expense.getAmount(),
                        expense.getCategory(),
                        expense.getAddedBy().getName(),
                        expense.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // ===== THIS METHOD IS NOW SECURED =====
    public List<BalanceResponse> getGroupBalances(Long groupId) {
        // 4. ADDED SECURITY CHECK
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        securityService.verifyUserIsMemberOfGroup(groupId, currentUser);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        List<Expense> expenses = expenseRepository.findByGroupId(groupId);
        List<ExpenseShare> shares = expenseShareRepository.findByExpense_GroupId(groupId);
        Map<Long, BigDecimal> balanceMap = members.stream()
                .collect(Collectors.toMap(member -> member.getUser().getId(), member -> new BigDecimal("0.00")));

        for (Expense expense : expenses) {
            Long paidById = expense.getAddedBy().getId();
            balanceMap.put(paidById, balanceMap.get(paidById).add(expense.getAmount()));
        }

        for (ExpenseShare share : shares) {
            Long owedById = share.getUser().getId();
            balanceMap.put(owedById, balanceMap.get(owedById).subtract(share.getShareAmount()));
        }

        return members.stream()
                .map(member -> new BalanceResponse(
                        member.getUser().getId(),
                        member.getUser().getName(),
                        balanceMap.get(member.getUser().getId())
                ))
                .collect(Collectors.toList());
    }

    // ===== THIS METHOD IS NOW SECURED =====
    public MonthlySummaryDto getMonthlySummary(Long groupId, String month) {
        // 5. ADDED SECURITY CHECK
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        securityService.verifyUserIsMemberOfGroup(groupId, currentUser);

        YearMonth yearMonth = YearMonth.parse(month);
        Timestamp startOfMonth = Timestamp.valueOf(yearMonth.atDay(1).atStartOfDay());
        Timestamp endOfMonth = Timestamp.valueOf(yearMonth.atEndOfMonth().atTime(23, 59, 59));
        List<Expense> expensesInMonth = expenseRepository.findByGroupIdAndCreatedAtBetween(groupId, startOfMonth, endOfMonth);
        BigDecimal totalSpent = expensesInMonth.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<User, BigDecimal> contributionsMap = expensesInMonth.stream()
                .collect(Collectors.groupingBy(
                        Expense::getAddedBy,
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        List<MemberContributionDto> memberContributions = contributionsMap.entrySet().stream()
                .map(entry -> new MemberContributionDto(
                        entry.getKey().getId(),
                        entry.getKey().getName(),
                        entry.getValue()
                ))
                .collect(Collectors.toList());

        return new MonthlySummaryDto(totalSpent, memberContributions);
    }
}