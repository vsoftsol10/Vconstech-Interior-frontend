import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidePannel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Icons
  const dashboardicon = (
    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
    </svg>
  );

  const siteEngg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M16 11h6" />
    </svg>
  );

  const createNewProject = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v1M12 11v6m3-3H9m-6 7h18a2 2 0 002-2V9a2 2 0 00-2-2H3v12a2 2 0 002 2z" />
    </svg>
  );

  const notification = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 17h5l-1.5-1.5A2 2 0 0 1 18 14v-3a6 6 0 1 0-12 0v3a2 2 0 0 1-.5 1.5L4 17h5m0 0v1a3 3 0 0 0 6 0v-1m-6 0h6" />
    </svg>
  );

  const ourEngineers = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 14c3.866 0 7 1.343 7 3v2H5v-2c0-1.657 3.134-3 7-3z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.5 3.5L17 5m-10 0l1.5-1.5M12 2v2" />
  </svg>
);

const ourProjects = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 21h18M5 21V9l7-4 7 4v12M9 21V13h6v8" />
  </svg>
);
  const logout = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24"
      height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const sidebarLinks = [
    { name: "Dashboard", path: "/contractorDashboard", icon: dashboardicon },
    { name: "Add Site Engineer", path: "/add-site-engg", icon: siteEngg },
    { name: "Create New Project", path: "/create-new-project", icon: createNewProject },
    { name: "Our Engineers", path: "/our-engg", icon: ourEngineers },
    { name: "Our Projects", path: "/our-projects", icon: ourProjects },
    { name: "Notification", path: "/notifications", icon: notification },
    { name: "Logout", path: "/", icon: logout },
  ];

  // Sync active link with URL path
  useEffect(() => {
    const currentIndex = sidebarLinks.findIndex(item => location.pathname === item.path);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const handleItemClick = (index, path) => {
    if (path === "/") {
      // Show confirmation popup for logout
      setShowLogoutPopup(true);
    } else {
      setActiveIndex(index);
      navigate(path);
    }
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    navigate("/"); // navigate after confirming
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-22 md:w-64 w-16 border-r border-gray-300 min-h-screen" style={{ backgroundColor: '#ffbe2a' }}>
        <div className="pt-4 flex flex-col">
          {sidebarLinks.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index, item.path)}
              className={`flex items-center py-3 px-4 gap-3 transition-colors duration-200 w-full text-left cursor-pointer
                ${activeIndex === index
                  ? "border-r-4 md:border-r-[6px] bg-black/10 border-black text-black font-semibold"
                  : "hover:bg-black/5 text-black"
                }`}
            >
              {item.icon}
              <p className="md:block hidden">{item.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmLogout}
                className="text-white font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#ffbe2a' }}
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidePannel;