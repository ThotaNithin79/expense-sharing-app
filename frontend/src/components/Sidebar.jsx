import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '~/components/ui/button'; // Import Shadcn's Button for consistency

// ----- ICONS (No changes needed, but kept for completeness) -----
const HomeIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const UsersIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197M15 21a9 9 0 00-9-9" /></svg>
);
const LogoutIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);


// The component now accepts a prop `isCollapsed`
const Sidebar = ({ isCollapsed }) => {
    const { logout } = useAuth();
    
    // We can use a helper component for links to keep the code DRY
    const NavItem = ({ to, icon, children }) => {
        const navLinkClass = "flex items-center justify-center md:justify-start gap-3 px-3 py-2 text-slate-300 rounded-md transition-colors";
        const getNavLinkClass = ({ isActive }) =>
            isActive
                ? `${navLinkClass} bg-slate-700 text-white`
                : `${navLinkClass} hover:bg-slate-800 hover:text-white`;

        return (
            <NavLink to={to} className={getNavLinkClass}>
                {icon}
                {/* On medium screens and up, show the text. Hide it on smaller screens if collapsed. */}
                <span className={isCollapsed ? "hidden" : "hidden md:inline"}>{children}</span>
            </NavLink>
        );
    };

    return (
        // The width and padding of the sidebar will now change based on the isCollapsed state
        <aside 
            className={`
                bg-slate-900 border-r border-slate-800 flex flex-col
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* Header section with conditional rendering for the title */}
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold text-white text-center">
                    {isCollapsed ? (
                        <span className="text-blue-500">SW</span>
                    ) : (
                        <>Share<span className="text-blue-500">Wise</span></>
                    )}
                </h1>
            </div>
            
            {/* Navigation links using our new NavItem component */}
            <nav className="flex-1 px-4 space-y-2">
                <NavItem to="/" icon={<HomeIcon />}>Dashboard</NavItem>
                <NavItem to="/group" icon={<UsersIcon />}>Group Members</NavItem>
            </nav>
            
            {/* Logout button also adapts to the collapsed state */}
            <div className="p-4">
                <Button 
                    variant="ghost" 
                    onClick={logout} 
                    className="w-full flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    <LogoutIcon />
                    <span className={isCollapsed ? "hidden" : "hidden md:inline"}>Log Out</span>
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;