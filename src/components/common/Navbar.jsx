import React from 'react'

const Navbar = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const interiors = [
    { name: 'Living Room', path: '/living-room' },
    { name: 'Bedroom', path: '/bedroom' },
    { name: 'Kitchen', path: '/kitchen' },
    { name: 'Bathroom', path: '/bathroom' },
    { name: 'Office', path: '/office' },
  ];

  const handleLogout = () => {
    alert('Logging out...');
  };

  const handleNotification = () => {
    alert('No new notifications');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Brand & Interiors */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interiors
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {interiors.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button
              onClick={handleNotification}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-slate-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {interiors.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar