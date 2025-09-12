import React from 'react';
import { useAuth } from '../context/AuthContext';
import GroupManagement from '../components/GroupManagement';
import { Skeleton } from '~/components/ui/skeleton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirects

// --- The Loader Component (no changes needed) ---
const GroupManagementLoader = () => (
    <div>
        <header className="mb-8">
            <Skeleton className="h-10 w-3/4 md:w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/2 md:w-1/3" />
        </header>
        <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700"><Skeleton className="h-6 w-1/4" /></div>
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-8 w-20" /></div>
                <div className="flex justify-between items-center"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-8 w-20" /></div>
            </div>
        </div>
    </div>
);


const GroupManagementPage = () => {
    // 1. GET ALL NECESSARY STATE DIRECTLY FROM THE GLOBAL CONTEXT
    const { activeGroup, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();

    // 2. THIS PAGE NO LONGER NEEDS its own useEffect, useState for the group, or error handling.
    // It's now a simple "presentational" component.

    // Handle the initial app-wide loading state from the context
    if (isAuthLoading) {
        return <GroupManagementLoader />;
    }
    
    // Handle the case where the user is logged in but has no group
    if (!activeGroup) {
        // This is a safety net. The main dashboard would have already redirected them,
        // but if they navigate here directly, we provide a helpful message.
        return (
            <div className="text-center mt-12">
                <h2 className="text-2xl font-bold">No Group Found</h2>
                <p className="text-slate-400 mt-2">
                    You must create or be added to a group to manage members.
                </p>
            </div>
        );
    }

    // This is the successful state, render the page content
    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Group Management</h1>
                <p className="text-slate-400">
                    Add or remove members from your group, '{activeGroup.groupName}'.
                </p>
            </header>
            {/* Pass the globally managed activeGroup directly to the child component */}
            <GroupManagement activeGroup={activeGroup} />
        </div>
    );
};

export default GroupManagementPage;