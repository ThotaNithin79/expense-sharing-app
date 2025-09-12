import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { createGroup } from '../api/groupApi';
import { toast } from 'sonner';

const CreateGroupPage = () => {
  const navigate = useNavigate();
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

    try {
      await createGroup({ name: groupName });
      toast.success(`Group "${groupName}" created successfully!`);
      // On success, redirect the user to their main dashboard
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create group.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create a New Group</h1>
          <p className="mt-2 text-slate-400">
            Give your new shared space a name.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-slate-300">
              Group Name
            </label>
            <Input
              id="groupName"
              placeholder="e.g., Downtown Loft"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Group
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;