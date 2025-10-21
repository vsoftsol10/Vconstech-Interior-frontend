import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import loginBack from "../../assets/login-BCK-2.mp4"
import { useNavigate } from 'react-router-dom';

export default function EmployeeLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/employee-dashboard")
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Video Background Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-900/70 via-orange-800/60 to-amber-950/50 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={loginBack} type="video/mp4" />
        </video>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <h1 className="text-6xl font-bold mb-6 tracking-wider uppercase">Employee</h1>
          <div className="w-16 h-1 bg-amber-400 mb-6"></div>
          <h2 className="text-2xl font-light mb-4">Login Portal</h2>
          <p className="text-center text-lg font-light max-w-md">
            Access your dashboard to manage project tasks, materials, files seamlessly through our ERP system.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">WELCOME</h2>
              <p className="text-gray-500 text-sm uppercase tracking-wide">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Demo Credentials
              </p>
              <p className="text-sm text-gray-700">Username: demo</p>
              <p className="text-sm text-gray-700">Password: demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}