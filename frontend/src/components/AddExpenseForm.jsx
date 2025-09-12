import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { addExpense } from '../api/expenseApi';
import { toast } from 'sonner';

// A simple icon for the file upload area
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mx-auto text-slate-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);


// Define the validation schema using Zod
const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  proofFile: z.instanceof(FileList).optional(),
});

const expenseCategories = ['Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Other'];

const AddExpenseForm = ({ activeGroup, onExpenseAdded }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      proofFile: undefined,
    },
  });

  // Get form state to disable button during submission
  const { formState: { isSubmitting }, register } = form;
  // We need to register the file input manually to get the ref
  const fileUploadRef = register("proofFile");

  const onSubmit = async (values) => {
    const expenseData = {
      groupId: activeGroup.groupId,
      title: values.title,
      amount: values.amount,
      category: values.category,
    };
    const proofFile = values.proofFile && values.proofFile.length > 0 ? values.proofFile[0] : null;

    try {
      await addExpense(expenseData, proofFile);
      toast.success('Expense added successfully!');
      
      form.reset(); // Reset the form fields
      onExpenseAdded(); // This function will close the modal and refresh data

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add expense.';
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      {/* Use a grid layout for better spacing and responsiveness */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekly Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* --- IMPROVEMENT 1: Responsive Grid --- */}
        {/* This div will be a 2-column grid on desktop, and stack to 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 1500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- IMPROVEMENT 2: Better File Upload UI --- */}
        <FormField
          control={form.control}
          name="proofFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof (Optional)</FormLabel>
              <FormControl>
                <label 
                  htmlFor="proof-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-700/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, or GIF</p>
                  </div>
                  <Input id="proof-upload" type="file" className="hidden" {...fileUploadRef} />
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
          {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
        </Button>
      </form>
    </Form>
  );
};

export default AddExpenseForm;