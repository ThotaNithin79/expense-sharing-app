import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

// A more visually engaging icon for this specific page
const GroupIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="size-16 mx-auto text-slate-500"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 15 9.75a3.75 3.75 0 0 1 3.75 3.75m-3.75 0h-7.5a3.75 3.75 0 0 1-3.75-3.75A3.75 3.75 0 0 1 9 9.75v1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 0 1 15 0" />
  </svg>
);


const PendingMember = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            {/* We will use Shadcn's Card component for a cleaner, more professional look */}
            <Card className="w-full max-w-lg bg-slate-800 border-slate-700 text-white shadow-xl">
                <CardHeader className="text-center">
                    <div className="mb-4">
                        <GroupIcon />
                    </div>
                    <CardTitle className="text-3xl">You're Almost There!</CardTitle>
                    <CardDescription className="text-slate-400 pt-2">
                        Your account is active, but you're not part of a group yet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div>
                        <h3 className="font-semibold text-white">Are you the first in your flat?</h3>
                        <p className="text-slate-400 text-sm">
                            If you're setting up a new shared space, create a group to start inviting your roommates.
                        </p>
                    </div>
                    
                    {/* Primary Call to Action */}
                    <Button 
                        onClick={() => navigate('/create-group')} 
                        size="lg" 
                        className="w-full md:w-auto"
                    >
                        Create a New Group
                    </Button>
                    
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-800 px-2 text-slate-500">Or</span>
                      </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">Were you invited by someone?</h3>
                        <p className="text-slate-400 text-sm">
                            Contact your group's admin and ask them to add your email to the group. Once they do, simply log out and log back in.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        onClick={logout} 
                        variant="ghost" 
                        className="w-full text-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                        Log Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PendingMember;