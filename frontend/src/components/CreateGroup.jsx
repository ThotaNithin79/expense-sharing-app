import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
// We'll create this API function in the next step
// import { createGroup } from '../api/groupApi'; 

const CreateGroup = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) {
      setError('Group name is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // This is a placeholder for now
    console.log("Creating group:", groupName);
    // In the real implementation, we will call the API here
    // const response = await createGroup({ name: groupName });
    // onGroupCreated(response.data);

    // Simulate API call for now
    setTimeout(() => {
      onGroupCreated({ id: Date.now(), name: groupName }); // Pass a dummy group back
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Welcome!</h2>
        <p className="text-center text-slate-400">
          You're not part of any group yet. Create one to get started.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-slate-300">
              Group Name
            </label>
            <Input
              id="groupName"
              placeholder="e.g., Flat A-101 Avengers"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" isLoading={isLoading}>
            Create Group
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;