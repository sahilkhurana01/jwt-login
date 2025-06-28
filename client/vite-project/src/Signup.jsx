import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imageLogo from './assets/image.png';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async () => {
        setError('');
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: name,
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Registration successful, navigate to login
                navigate('/login', { 
                    state: { 
                        message: 'Account created successfully! Please login.' 
                    } 
                });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[750px]">
                    <div className="px-6 pb-8">
                        {/* Logo */}
                        <div className="flex items-center justify-center mt-4 mb-8">
                            <img src={imageLogo} className="h-23" alt="Logo" />
                        </div>

                        {/* Heading */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-2xl font-bold text-gray-800">Create Account</h1>
                            <p className="text-sm text-gray-500">Sign up to get started</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            {/* Signup Button */}
                            <button
                                onClick={handleSignup}
                                disabled={isLoading}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </button>

                            {/* Already have account */}
                            <div className="mt-4 text-center">
                                <span className="text-sm text-gray-500">
                                    Already have an account?
                                    <button 
                                        onClick={handleLoginClick}
                                        className="text-[rgba(228,1,2,1)] font-medium ml-1 hover:cursor-pointer">
                                        Login
                                    </button>
                                </span>
                            </div>
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

export default Signup;
