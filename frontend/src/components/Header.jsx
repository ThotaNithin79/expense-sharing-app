import React from 'react';
import { Button } from '~/components/ui/button';

// Hamburger Menu Icon
const MenuIcon = () => (
    <svg 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


const Header = ({ onMenuClick }) => {
    return (
        <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center">
            {/* The md:hidden class makes this entire header visible only on mobile and tablet */}
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
                <MenuIcon />
            </Button>
            <div className="ml-4">
                <h1 className="text-xl font-bold text-white">Share<span className="text-blue-500">Wise</span></h1>
            </div>
        </header>
    );
};

export default Header;