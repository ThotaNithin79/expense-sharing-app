import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { forgotPassword } from '../api/authApi';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // To show the success/info message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await forgotPassword(email);
      // We display the generic success message from the backend
      setMessage(response.data.message);
      toast.success("Request submitted successfully.");
    } catch (error) {
      // For security, even on error, we show a generic success message
      // This prevents attackers from knowing which emails are registered.
      setMessage("If an account with that email exists, a password reset link has been sent.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Forgot Your Password?</CardTitle>
          <CardDescription className="text-slate-400 pt-2">
            No problem. Enter your email address below and we'll send you a link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* If a message exists, we show it and hide the form */}
          {message ? (
            <div className="text-center space-y-4">
              <p className="text-green-400">{message}</p>
              <p className="text-slate-400 text-sm">
                Please check your inbox (and spam folder).
              </p>
              <Button asChild variant="link" className="text-blue-400">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            // Otherwise, we show the form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" isLoading={isLoading} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;