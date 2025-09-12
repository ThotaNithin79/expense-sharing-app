package com.roomshare.repository;

import com.roomshare.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // Make sure to import List
import java.sql.Timestamp; // Import Timestamp

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Spring Data JPA automatically generates the query from the method name
    List<Expense> findByGroupId(Long groupId);

    // NEW METHOD: Finds all expenses for a group within a given time frame.
    List<Expense> findByGroupIdAndCreatedAtBetween(Long groupId, Timestamp startOfMonth, Timestamp endOfMonth);
}