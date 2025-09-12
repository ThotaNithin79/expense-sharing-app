import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGroupMembers, addGroupMember, removeGroupMember } from '../api/groupApi';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';

// Validation schema for the "add member" form
const addMemberSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const GroupManagement = ({ activeGroup }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch and update the member list
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await getGroupMembers(activeGroup.groupId);
      setMembers(response.data);
    } catch (error) {
      toast.error("Failed to fetch group members.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch members when the component first loads
  useEffect(() => {
    fetchMembers();
  }, [activeGroup.groupId]);

  const handleRemoveMember = async (userId) => {
    try {
      await removeGroupMember(activeGroup.groupId, userId);
      toast.success("Member removed successfully.");
      fetchMembers(); // Refresh the list after removing
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove member.";
      toast.error(errorMessage);
    }
  };

  // Form setup for adding a new member
  const form = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "" },
  });

  const onAddMemberSubmit = async (values) => {
    try {
      await addGroupMember(activeGroup.groupId, values.email);
      toast.success(`User ${values.email} added to the group.`);
      form.reset();
      fetchMembers(); // Refresh the list after adding
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add member.";
      toast.error(errorMessage);
    }
  };
  
  // Determine if the current user is an admin
  const currentUserIsAdmin = activeGroup.userRole === 'ADMIN';

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Group Members</h2>
      
      {/* Add Member Form (only visible to admins) */}
      {currentUserIsAdmin && (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onAddMemberSubmit)} 
            className="flex items-start gap-2 mb-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Enter user's email to add" {...field} />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </form>
        </Form>
      )}

      {/* Members Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              {currentUserIsAdmin && <TableHead className="text-right text-white">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-slate-400">Loading members...</TableCell></TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.userId} className="border-slate-700">
                  <TableCell>{member.name}</TableCell>
                  <TableCell className="text-slate-400">{member.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.role === 'ADMIN' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {member.role}
                    </span>
                  </TableCell>
                  {currentUserIsAdmin && (
                    <TableCell className="text-right">
                      {/* Show remove button for everyone except the user themselves */}
                      {activeGroup.userRole === 'ADMIN' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Remove</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                This will permanently remove {member.name} from the group.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-700 border-none hover:bg-slate-600">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveMember(member.userId)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, remove member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GroupManagement;