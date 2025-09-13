import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '~/components/ui/button';
import BalanceSummary from '../components/BalanceSummary';
import ExpenseList from '../components/ExpenseList';
import { getExpensesForGroup, getBalancesForGroup } from '../api/expenseApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import AddExpenseForm from '../components/AddExpenseForm';
import DashboardLoader from '../components/DashboardLoader';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const DashboardPage = () => {
    // Get the activeGroup directly from the context. We know it exists here.
    const { activeGroup } = useAuth();

    const [balances, setBalances] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        if (!activeGroup) return;
        try {
            setIsLoadingData(true);
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
            setIsLoadingData(false);
        }
    }, [activeGroup]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleExpenseAdded = () => {
        setIsAddExpenseOpen(false);
        setTimeout(() => fetchDashboardData(), 200);
    };

    if (isLoadingData) {
        return <DashboardLoader />;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-0">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{activeGroup.groupName}</h1>
                    <p className="text-slate-400">Welcome back! Here's the latest summary.</p>
                </div>
                <div className="hidden md:block">
                    <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                        <DialogTrigger asChild><Button>Add New Expense</Button></DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white">
                            <DialogHeader><DialogTitle>Add a New Expense</DialogTitle></DialogHeader>
                            <AddExpenseForm activeGroup={activeGroup} onExpenseAdded={handleExpenseAdded} />
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="space-y-8">
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <BalanceSummary balances={balances} />
                <ExpenseList expenses={expenses} onAddExpense={() => setIsAddExpenseOpen(true)} />
            </main>
            
            <div className="md:hidden fixed bottom-6 right-6">
                 <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
                            <PlusIcon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader><DialogTitle>Add a New Expense</DialogTitle></DialogHeader>
                        <AddExpenseForm activeGroup={activeGroup} onExpenseAdded={handleExpenseAdded} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default DashboardPage;