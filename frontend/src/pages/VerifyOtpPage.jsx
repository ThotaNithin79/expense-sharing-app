import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { verifyOtp } from '../api/authApi';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ** THE FIX IS HERE **
  // We no longer need useState for the email since it doesn't change.
  // We just declare it as a constant. This removes the unused 'setEmail' function.
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      const verificationData = { email, otp };
      const response = await verifyOtp(verificationData);

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Verify Your Account</h1>
          <p className="mt-2 text-slate-400">
            An OTP has been sent to <span className="font-medium text-blue-400">{email}</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-300">
              One-Time Password (OTP)
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm text-center">{successMessage}</p>}

          <div>
            <Button type="submit" isLoading={isLoading} disabled={!!successMessage}>
              Verify Account
            </Button>
          </div>
        </form>
         <p className="text-sm text-center text-slate-400">
          Didn't receive the code?{' '}
          <Link to="/signup" className="font-medium text-blue-400 hover:underline">
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;