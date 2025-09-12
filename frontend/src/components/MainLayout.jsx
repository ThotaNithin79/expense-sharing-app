import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // This import is now used

const MainLayout = () => {
    // State to manage the sidebar's open/closed status on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation(); // Hook to detect route changes

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // This useEffect hook closes the mobile sidebar automatically whenever the user navigates to a new page.
    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]); // Dependency: runs every time the URL path changes

    return (
        <div className="flex h-screen bg-slate-950 text-white">
            {/* --- DESKTOP SIDEBAR --- */}
            {/* Tailwind classes 'hidden md:flex' mean: hidden on small screens, flex (visible) on medium screens and up. */}
            <div className="hidden md:flex">
                {/* On desktop, the sidebar is never collapsed. */}
                <Sidebar isCollapsed={false} /> 
            </div>

            {/* --- MOBILE SIDEBAR (As an overlay) --- */}
            {/* This div is only rendered on mobile (md:hidden). It slides in and out based on state. */}
            <div 
                className={`
                    fixed inset-0 z-40 transition-transform duration-300 ease-in-out md:hidden
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* On mobile, the sidebar is never collapsed when it's open. */}
                <Sidebar isCollapsed={false} />
            </div>
            
            {/* Backdrop overlay for when the mobile sidebar is open. Clicking it closes the sidebar. */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            
            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* The Header is only visible on mobile (md:hidden) and receives the toggle function */}
                <Header onMenuClick={toggleSidebar} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;