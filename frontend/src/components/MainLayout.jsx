import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import PendingMember from './PendingMember'; // We'll render this directly
import DashboardLoader from './DashboardLoader'; // Use the loader here

const MainLayout = () => {
    // Get the global state from our AuthContext
    const { activeGroup, isLoading: isAuthLoading } = useAuth();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    // --- RENDER LOGIC ---
    
    // 1. Show a full-page loader while the context is fetching the user's state
    if (isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <DashboardLoader />
            </div>
        );
    }
    
    // 2. If the user has no group, show the PendingMember component as the main content
    if (!activeGroup) {
        return <PendingMember />;
    }

    // 3. If the user HAS a group, render the full application layout
    return (
        <div className="flex h-screen bg-slate-950 text-white">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Overlay) */}
            <div className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>
            
            {/* Backdrop */}
            {isSidebarOpen && (<div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={toggleSidebar}></div>)}
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    {/* The Outlet will now render DashboardPage, GroupManagementPage, etc. */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;