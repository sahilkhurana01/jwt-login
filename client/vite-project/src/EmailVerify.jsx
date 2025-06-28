import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageLogo from './assets/image.png';

const EmailVerify = () => {
    const navigate = useNavigate();

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

                        {/* Email Verification Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verification</h1>
                            <p className="text-gray-500 text-sm">Please check your email and verify your account</p>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-3xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Verification Required</h3>
                                <p className="text-gray-600 text-sm">We've sent a verification link to your email address. Please click the link to verify your account.</p>
                            </div>

                            {/* Back to Login Button */}
                            <button
                                onClick={handleBackToLogin}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold transition-colors mt-6"
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

export default EmailVerify;
