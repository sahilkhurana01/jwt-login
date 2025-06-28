import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageLogo from './assets/image.png';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/send-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('OTP sent successfully! Please check your email.');
                // Navigate to OTP verification page after a short delay
                setTimeout(() => {
                    navigate('/otpverify', { state: { email } });
                }, 1500);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[600px]">
                    <div className="px-6 pb-8">
                        {/* Logo */}
                        <div className="flex items-center justify-center mt-4 mb-8">
                            <img src={imageLogo} className="h-20" alt="Logo" />
                        </div>

                        {/* Reset Password Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                            <p className="text-gray-500 text-sm">Enter your email to receive a reset OTP</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 rounded-3xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            {/* Success Message */}
                            {success && <p className="text-green-500 text-sm">{success}</p>}

                            {/* Send OTP Button */}
                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading || !email}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>

                            {/* Back to Login Button */}
                            <button
                                onClick={handleBackToLogin}
                                className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-3xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="flex justify-center pb-2">
                        <div className="w-32 h-1 bg-black rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
