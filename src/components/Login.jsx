import React, { useState } from 'react';
import { Lock, User, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const navigate =useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard")
    console.log('Login attempted with:', { username, password });
  };

  return (
    <div className="min-w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-500 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-yellow-500/30 p-8 relative overflow-hidden">
          {/* Yellow accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl">
                  <Home className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
              Interior ERP
            </h2>
            <p className="text-center text-yellow-500/70 mb-8 text-sm uppercase tracking-wide">
              Enterprise Resource Planning
            </p>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-yellow-400/80 text-xs font-semibold mb-2 uppercase tracking-wide">
                Username
              </label>
              <div 
                className={`relative bg-black/40 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 ${
                  isFocused.username 
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                    : 'border-yellow-500/20'
                }`}
              >
                <div className="flex items-center px-4 py-4">
                  <User className={`w-5 h-5 transition-colors ${
                    isFocused.username ? 'text-yellow-400' : 'text-yellow-500/50'
                  }`} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, username: true })}
                    onBlur={() => setIsFocused({ ...isFocused, username: false })}
                    className="flex-1 ml-3 bg-transparent text-white placeholder-gray-500 outline-none"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <label className="block text-yellow-400/80 text-xs font-semibold mb-2 uppercase tracking-wide">
                Password
              </label>
              <div 
                className={`relative bg-black/40 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 ${
                  isFocused.password 
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                    : 'border-yellow-500/20'
                }`}
              >
                <div className="flex items-center px-4 py-4">
                  <Lock className={`w-5 h-5 transition-colors ${
                    isFocused.password ? 'text-yellow-400' : 'text-yellow-500/50'
                  }`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    className="flex-1 ml-3 bg-transparent text-white placeholder-gray-500 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 flex items-center justify-center group uppercase tracking-wide"
            >
              <span>Sign In</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-400/80 text-xs font-semibold mb-2 uppercase tracking-wide text-center">
                Demo Credentials
              </p>
              <div className="space-y-1 text-center">
                <p className="text-yellow-500/70 text-sm">
                  <span className="text-yellow-400">Username:</span> demo
                </p>
                <p className="text-yellow-500/70 text-sm">
                  <span className="text-yellow-400">Password:</span> demo123
                </p>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <button className="text-yellow-500/60 hover:text-yellow-400 text-sm transition-colors">
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-yellow-500/20 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-yellow-500/20 rounded-bl-3xl"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500 rounded-full opacity-10 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-400 rounded-full opacity-10 blur-2xl" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default Login;