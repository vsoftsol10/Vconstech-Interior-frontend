import React, { useState } from 'react';
import { Lock, User, Home, Mail, Building, UserCog, AlertCircle, CheckCircle } from 'lucide-react';
import bgLogin from '../assets/login-BCK-2.mp4';
const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    role: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });
  const [isFocused, setIsFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://localhost:5000/api/auth';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and ensure the server is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupData.name || !signupData.email || !signupData.role ||
      !signupData.companyName || !signupData.password || !signupData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          role: signupData.role,
          companyName: signupData.companyName,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setSignupData({
          name: '',
          email: '',
          role: '',
          companyName: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and ensure the server is running.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field, focused) => {
    setIsFocused({ ...isFocused, [field]: focused });
  };

  const roles = ['Admin', 'Site_Engineer'];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={bgLogin}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-gray-900 to-amber-400 opacity-70"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              // backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white mb-4">INTERIOR ERP</h1>
            <p className="text-xl text-gray-100 mb-8">Admin Login</p>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: '#ffbe2a' }}></div>
            <p className="text-gray-100 mt-8 text-lg">
              {activeTab === 'login'
                ? 'Access the complete control panel to manage projects, materials, and teams efficiently.'
                : 'Join us and transform your business operations today.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">INTERIOR</h1>
            <p className="text-gray-600">Enterprise Resource Planning</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${activeTab === 'login'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${activeTab === 'signup'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' && (
              <div>
                <h2 className="text-2xl font-bold uppercase text-center text-black mb-2">Welcome</h2>
                <p className="text-gray-600 mb-8 uppercase text-center">sign in to your account</p>

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.loginEmail ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Mail className={`w-5 h-5 transition-colors ${isFocused.loginEmail ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          onFocus={() => handleFocus('loginEmail', true)}
                          onBlur={() => handleFocus('loginEmail', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.loginPassword ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Lock className={`w-5 h-5 transition-colors ${isFocused.loginPassword ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          onFocus={() => handleFocus('loginPassword', true)}
                          onBlur={() => handleFocus('loginPassword', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Enter your password"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-black font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#ffbe2a' }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>


              </div>
            )}

            {activeTab === 'signup' && (
              <div className="max-h-[550px] overflow-y-auto pr-2">
                <h2 className="text-2xl font-bold uppercase text-center text-black mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6 uppercase text-center">sign up for a new account</p>

                <form onSubmit={handleSignupSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.name ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <User className={`w-5 h-5 transition-colors ${isFocused.name ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="text"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          onFocus={() => handleFocus('name', true)}
                          onBlur={() => handleFocus('name', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Enter your full name"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.email ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Mail className={`w-5 h-5 transition-colors ${isFocused.email ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          onFocus={() => handleFocus('email', true)}
                          onBlur={() => handleFocus('email', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.role ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <UserCog className={`w-5 h-5 transition-colors ${isFocused.role ? 'text-black' : 'text-gray-400'
                          }`} />
                        <select
                          value={signupData.role}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          onFocus={() => handleFocus('role', true)}
                          onBlur={() => handleFocus('role', false)}
                          className="flex-1 ml-3 bg-transparent text-black outline-none"
                          disabled={loading}
                        >
                          <option value="">Select your role</option>
                          {roles.map((role) => (
                            <option key={role} value={role}>{role.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.companyName ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Building className={`w-5 h-5 transition-colors ${isFocused.companyName ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="text"
                          value={signupData.companyName}
                          onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                          onFocus={() => handleFocus('companyName', true)}
                          onBlur={() => handleFocus('companyName', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Enter your company name"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.signupPassword ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Lock className={`w-5 h-5 transition-colors ${isFocused.signupPassword ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          onFocus={() => handleFocus('signupPassword', true)}
                          onBlur={() => handleFocus('signupPassword', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Create a password (min 6 chars)"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div
                      className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${isFocused.confirmPassword ? 'border-black' : 'border-gray-300'
                        }`}
                    >
                      <div className="flex items-center px-4 py-3">
                        <Lock className={`w-5 h-5 transition-colors ${isFocused.confirmPassword ? 'text-black' : 'text-gray-400'
                          }`} />
                        <input
                          type="password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          onFocus={() => handleFocus('confirmPassword', true)}
                          onBlur={() => handleFocus('confirmPassword', false)}
                          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
                          placeholder="Confirm your password"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-black font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#ffbe2a' }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;