import React from 'react';
import ExpenseItem from './ExpenseItem';
import EmptyState from './EmptyState'; // <<<--- IMPORT
import { Button } from '~/components/ui/button'; // <<<--- IMPORT

// The component now accepts an onAddExpense prop
const ExpenseList = ({ expenses, onAddExpense }) => { 
  if (!expenses || expenses.length === 0) {
    // ** THE FIX IS HERE **
    // Instead of a simple <p> tag, we render the EmptyState component.
    return (
      <EmptyState
        title="No Expenses Yet"
        description="Get started by adding your first bill or shared cost."
      >
        {/* The button to open the modal is passed as a child */}
        <Button onClick={onAddExpense}>
          Add Your First Expense
        </Button>
      </EmptyState>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-white">Recent Expenses</h2>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;