import React, { useState } from 'react';
import { Lock, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const navigate= useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    navigate("/dashboard")
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-8">
              <Home className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">INTERIOR</h1>
            <p className="text-xl text-gray-300 mb-8">Enterprise Resource Planning</p>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: '#ffbe2a' }}></div>
            <p className="text-gray-400 mt-8 text-lg">
              Streamline your business operations with our comprehensive ERP solution
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">INTERIOR</h1>
            <p className="text-gray-600">Enterprise Resource Planning</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold uppercase text-center text-black mb-2">Welcome </h2>
            <p className="text-gray-600 mb-8 uppercase text-center " > sign in to your account</p>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div 
                className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${
                  isFocused.username 
                    ? 'border-black' 
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center px-4 py-3">
                  <User className={`w-5 h-5 transition-colors ${
                    isFocused.username ? 'text-black' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, username: true })}
                    onBlur={() => setIsFocused({ ...isFocused, username: false })}
                    className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                
              </div>
              <div 
                className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${
                  isFocused.password 
                    ? 'border-black' 
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center px-4 py-3">
                  <Lock className={`w-5 h-5 transition-colors ${
                    isFocused.password ? 'text-black' : 'text-gray-400'
                  }`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full text-black font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#ffbe2a' }}
            >
              Sign In
            </button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Username:</span> demo
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Password:</span> demo123
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Login;