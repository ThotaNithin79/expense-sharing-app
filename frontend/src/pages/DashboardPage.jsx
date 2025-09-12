import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '~/components/ui/button';
import BalanceSummary from '../components/BalanceSummary';
import ExpenseList from '../components/ExpenseList';
import { getExpensesForGroup, getBalancesForGroup } from '../api/expenseApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import AddExpenseForm from '../components/AddExpenseForm';
import DashboardLoader from '../components/DashboardLoader';

// A simple Plus icon for the mobile "Add Expense" button
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const DashboardPage = () => {
    // Get the global state from our AuthContext
    const { activeGroup, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();

    // State for this page's specific data
    const [balances, setBalances] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true); // For this page's data
    const [error, setError] = useState('');
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        // No need to pass group anymore, we get it from the context
        if (!activeGroup) return;

        try {
            setIsDataLoading(true);
            setError('');
            const [balancesResponse, expensesResponse] = await Promise.all([
                getBalancesForGroup(activeGroup.groupId),
                getExpensesForGroup(activeGroup.groupId),
            ]);
            setBalances(balancesResponse.data);
            setExpenses(expensesResponse.data);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setIsDataLoading(false);
        }
    }, [activeGroup]); // Dependency is now the activeGroup from context

    // This effect handles what to do based on the global auth state
    useEffect(() => {
        if (!isAuthLoading) {
            if (activeGroup) {
                fetchDashboardData();
            } else {
                // If the global state has loaded and user has no group, redirect
                navigate('/welcome');
            }
        }
    }, [isAuthLoading, activeGroup, navigate, fetchDashboardData]);

    const handleExpenseAdded = () => {
        setIsAddExpenseOpen(false);
        // Refresh data after a short delay
        setTimeout(() => fetchDashboardData(), 200);
    };
    
    // The main app loading is handled by the context's `isLoading`.
    // We show our loader if the context is loading OR if this page is fetching data.
    if (isAuthLoading || isDataLoading) {
        return <DashboardLoader />;
    }
    
    if (error) {
        return <div className="p-8 text-center text-red-400">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{activeGroup.groupName}</h1>
                    <p className="text-slate-400">
                        Welcome back! Here's the latest summary of your group's expenses.
                    </p>
                </div>
                <div className="hidden md:block">
                    <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                        <DialogTrigger asChild>
                            <Button>Add New Expense</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white">
                            <DialogHeader>
                                <DialogTitle>Add a New Expense</DialogTitle>
                            </DialogHeader>
                            <AddExpenseForm activeGroup={activeGroup} onExpenseAdded={handleExpenseAdded} />
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="space-y-8">
                <BalanceSummary balances={balances} />
                <ExpenseList
                    expenses={expenses}
                    onAddExpense={() => setIsAddExpenseOpen(true)}
                />
            </main>
            
            <div className="md:hidden fixed bottom-6 right-6">
                 <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
                            <PlusIcon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Add a New Expense</DialogTitle>
                        </DialogHeader>
                        <AddExpenseForm activeGroup={activeGroup} onExpenseAdded={handleExpenseAdded} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default DashboardPage;