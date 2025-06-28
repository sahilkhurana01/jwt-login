import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageLogo from './assets/image.png';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
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

                        {/* Welcome Message */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Dashboard</h1>
                            <p className="text-gray-500 text-sm">You have successfully logged in!</p>
                        </div>

                        {/* Dashboard Content */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-3xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Your Account</h3>
                                <p className="text-gray-600 text-sm">This is your dashboard area where you can manage your account and view your information.</p>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
                                <p className="text-gray-600 text-sm">No recent activity to display.</p>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full bg-[rgba(228,1,2,1)] text-white py-3 rounded-3xl font-semibold transition-colors mt-6"
                            >
                                Logout
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

export default Dashboard; 