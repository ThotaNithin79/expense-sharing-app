import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="max-w-xl p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Welcome to Your Shared Space
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          You're not part of any group yet. Get started by creating a new group
          to manage and split expenses with your roommates.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/create-group')}
          >
            Create Your First Group
          </Button>
          {/* We can add this button in the future */}
          {/* <Button size="lg" variant="outline">
            Join a Group
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;