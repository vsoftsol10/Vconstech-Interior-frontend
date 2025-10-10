import { Bell, LogOut, X } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate =useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/")
    // Add your actual logout logic here
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleNotification = () => {
    alert('No new notifications');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#ffbe2a] via-amber-300 to-[#ffbe2a] border-t-4 border-b-4 border-slate-800 shadow-md">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center gap-3">
                <h1 className="text-xl sm:text-3xl uppercase font-black text-slate-900 tracking-tight">
                  Interiors
                </h1>
              </div>
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <button
                onClick={handleNotification}
                className="p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 relative"
                aria-label="Notifications"
              >
                <Bell size={22} strokeWidth={2.5} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 hover:bg-slate-800 transition-colors duration-200 font-semibold uppercase text-sm tracking-wide"
                aria-label="Logout"
              >
                <span>Logout</span>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
                <LogOut className="h-6 w-6 text-amber-600" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Confirm Logout
              </h3>
              
              <p className="text-slate-600 mb-6">
                Do you really want to logout?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-2.5 bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition-colors duration-200 uppercase text-sm tracking-wide"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2.5 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors duration-200 uppercase text-sm tracking-wide"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar