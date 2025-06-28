import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import imageLogo from './assets/image.png';

const OtpVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/resetpassword');
            return;
        }

        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, email, navigate]);

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpString
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Navigate to new password page with email and OTP
                navigate('/newpassword', { 
                    state: { 
                        email: email, 
                        otp: otpString 
                    } 
                });
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');

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
                setTimer(900); // 15 minutes
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToReset = () => {
        navigate('/resetpassword');
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

                        {/* OTP Verification Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h1>
                            <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                            <p className="text-gray-800 font-medium">{email}</p>
                        </div>

                        {/* OTP Input */}
                        <div className="space-y-6">
                            <div className="flex justify-center space-x-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center border border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            {/* Timer */}
                            {timer > 0 && (
                                <p className="text-center text-gray-500 text-sm">
                                    Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                </p>
                            )}

                            {/* Verify Button */}
                            <button
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otp.join('').length !== 6}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            {/* Resend OTP Button */}
                            <button
                                onClick={handleResendOtp}
                                disabled={isLoading || timer > 0}
                                className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-3xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Resend OTP'}
                            </button>

                            {/* Back Button */}
                            <button
                                onClick={handleBackToReset}
                                className="w-full text-gray-500 py-2 font-medium"
                            >
                                Back to Reset Password
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

export default OtpVerify; 