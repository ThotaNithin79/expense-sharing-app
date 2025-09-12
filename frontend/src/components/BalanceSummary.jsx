import React from 'react';
import EmptyState from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'; // Import Shadcn's Card

// A simple icon to add more visual appeal
const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a9 9 0 0 0-18 0" />
    </svg>
);


const BalanceSummary = ({ balances }) => {
    // --- IMPROVEMENT 1: Better Empty State ---
    // The empty state is now more consistent with the overall page structure.
    if (!balances || balances.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                    <WalletIcon />
                    Balance Summary
                </h2>
                <EmptyState
                    title="You're all settled up!"
                    description="When you add expenses, you'll see a real-time summary of who owes whom right here."
                />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                <WalletIcon />
                Balance Summary
            </h2>
            {/* --- IMPROVEMENT 2: More Responsive Grid --- */}
            {/* This grid will be 1 column on mobile, 2 on tablet, and 3 on desktop for better spacing. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {balances.map((balance) => (
                    // --- IMPROVEMENT 3: Use Shadcn's Card Component ---
                    // This gives a more professional and consistent look. Added hover effects.
                    <Card 
                        key={balance.userId} 
                        className="bg-slate-800 border-slate-700 text-white shadow-lg transition-all hover:border-blue-500 hover:scale-[1.02]"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {balance.name}
                            </CardTitle>
                            {/* Visual Indicator: Green for positive, Red for negative, Gray for zero */}
                            <span className={`h-3 w-3 rounded-full ${
                                balance.balance > 0 ? 'bg-green-500' 
                                : balance.balance < 0 ? 'bg-red-500' 
                                : 'bg-slate-500'
                            }`}></span>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${
                                balance.balance > 0 ? 'text-green-400' 
                                : balance.balance < 0 ? 'text-red-400' 
                                : 'text-slate-400'
                            }`}>
                                {balance.balance > 0.00 ? `+ ₹${balance.balance.toFixed(2)}` 
                                : balance.balance < 0.00 ? `- ₹${Math.abs(balance.balance).toFixed(2)}`
                                : `₹0.00`}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {balance.balance > 0.00 ? 'Is owed by the group' 
                                : balance.balance < 0.00 ? 'Owes the group'
                                : 'Is settled up'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BalanceSummary;