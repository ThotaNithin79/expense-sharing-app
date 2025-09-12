import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { resetPassword } from '../api/authApi';
import { toast } from 'sonner';

// Validation schema for the reset password form
const formSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error will be shown under the confirm password field
});


const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL query parameters
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // This effect runs once to get the token from the URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("No reset token found. Please try the 'Forgot Password' process again.");
    }
  }, [searchParams]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setError('');
    try {
      const resetData = { token, newPassword: values.password };
      await resetPassword(resetData);
      
      toast.success("Password reset successfully!");
      setIsSuccess(true); // Set success state to show a message

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. The token may be invalid or expired.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const renderContent = () => {
    // If there's a fatal error (like no token), show an error message
    if (error && !token) {
      return (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <Button asChild variant="link" className="mt-4 text-blue-400">
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      );
    }

    // If the password reset was successful, show a confirmation message
    if (isSuccess) {
        return (
            <div className="text-center space-y-4">
              <p className="text-green-400">Your password has been changed successfully.</p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Proceed to Login
              </Button>
            </div>
        );
    }

    // Otherwise, show the password reset form
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    );
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Set a New Password</CardTitle>
          <CardDescription className="text-slate-400 pt-2">
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;