import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css'; 
import imageLogo from './assets/image.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Display success message from navigation state
    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
            // Clear the message from navigation state
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // Login successful, navigate to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login attempted');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        navigate('/resetpassword');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            {/* Mobile Phone Container */}
            <div className="w-full max-w-sm mx-auto">
              
                    <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[700px]">
                        {/* Status Bar */}
                       
                        {/* Content */}
                        <div className="px-6 pb-8">
                            {/* Logo and App Name */}
                            <div className="flex items-center justify-center mt-4 mb-8">
                                <div className="flex items-center gap-2">
                                <img src={imageLogo} className='h-23' alt="" />
                                </div>
                            </div>

                            {/* Welcome Text */}
                            <div className="mb-8 text-center">
                                <h1 className="mb-2 text-2xl font-bold text-gray-800">Welcome Back</h1>
                                <p className="text-sm text-gray-500">Login to access your account</p>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                {/* Error Message */}
                                {error && <p className="text-sm text-center text-red-500">{error}</p>}

                                {/* Success Message */}
                                {success && <p className="text-sm text-center text-green-500">{success}</p>}

                                {/* Email Input */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right">
                                <button 
                                    onClick={handleForgotPassword}
                                    className="text-[rgba(228,1,2,1)] text-sm font-medium hover:cursor-pointer">
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                className="w-full hover:cursor-pointer bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold  disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>

                                {/* Google Login Button */}
                                {/* <button
                                    onClick={handleGoogleLogin}
                                    className="flex items-center justify-center w-full gap-3 py-3 mt-4 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button> */}

                                {/* Sign Up Link */}
                                <div className="text-center mt-9">
                                    <span className="text-sm text-gray-500">
                                        Don't have an account?
                                    <button 
                                        onClick={handleSignupClick}
                                        className="text-[rgba(228,1,2,1)] font-medium hover:cursor-pointer ml-1">
                                            Sign up
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

            {/* Desktop Version */}
            <div className="fixed inset-0 hidden lg:block bg-gray-50">
                <div className="flex items-center justify-center min-h-screen p-8">
                    <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
                        {/* Logo and App Name */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center gap-3">
                                {/* <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl">
                                    <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                    </div>
                                </div> */}
                               <img src={imageLogo} className='h-20' alt="" />
                            </div>
                        </div>

                        {/* Welcome Text */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome Back</h1>
                            <p className="text-gray-500">Login to access your account</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute text-gray-400 transform -translate-y-1/2 rounded-3xl right-3 top-1/2 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <button 
                                    onClick={handleForgotPassword}
                                    className="text-[rgba(228,1,2,1)] text-sm font-medium hover: cursor-pointer">
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold  disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover: cursor-pointer"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                            {/* Google Login Button */}
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center w-full gap-3 py-3 font-medium text-gray-700 transition-colors bg-white border border-gray-300 cursor-pointer rounded-3xl hover:bg-gray-50 hover:"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <span className="text-gray-500">
                                    Don't have an account?
                                    <button 
                                        onClick={handleSignupClick}
                                        className="text-[rgba(228,1,2,1)] font-medium ml-1  hover: cursor-pointer">
                                        Sign up
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;