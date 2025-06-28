import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import imageLogo from './assets/image.png';

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { email, otp } = location.state || {};

    if (!email || !otp) {
        navigate('/resetpassword');
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setError('');
        const { newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Password reset successful, navigate to login
                navigate('/login', { 
                    state: { 
                        message: 'Password reset successfully! Please login with your new password.' 
                    } 
                });
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToOtp = () => {
        navigate('/otpverify', { state: { email } });
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

                        {/* New Password Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h1>
                            <p className="text-gray-500 text-sm">Enter your new password</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">New Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
                                        className="w-full border border-gray-300 rounded-3xl px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm new password"
                                    className="w-full border border-gray-300 rounded-3xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
                            >
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>

                            {/* Back Button */}
                            <button
                                onClick={handleBackToOtp}
                                className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-3xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Back to OTP Verification
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

export default NewPassword; 