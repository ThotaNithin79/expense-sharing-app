package com.roomshare.repository;

import com.roomshare.entity.ExpenseShare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // Make sure to import List

public interface ExpenseShareRepository extends JpaRepository<ExpenseShare, Long> {
    // This method name tells Spring Data JPA to look through ExpenseShare -> Expense -> Group -> Id
    List<ExpenseShare> findByExpense_GroupId(Long groupId);
}