import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import project from "../../assets/Icon/ProjectManagement.png";
import material from "../../assets/Icon/MaterialManagement.png";
import financial from "../../assets/Icon/FinancialManagement.png";
import contract from "../../assets/Icon/ContractManagement.png";
import file from "../../assets/Icon/FileManagement.png";
import settings from "../../assets/Icon/Settings.png";

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

  const projectIcon = (
  <img src={project} alt="project Management" />

  );

  const materialIcon = (
  <img src={material} alt="project Management" />

  );

  const financialIcon = (
  <img src={financial} alt="project Management" />

  );

  const contractIcon = (
  <img src={contract} alt="project Management" />

);

const fileIcon = (
  <img src={file} alt="project Management" />

);
const SettingIcon = (
  <img src={settings} alt="project Management" />

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
    { name: "Project Management", path: "/add-site-engg", icon: projectIcon },
    { name: "Material Management", path: "/create-new-project", icon: materialIcon },
    { name: "Financial Management", path: "/our-engg", icon: financialIcon },
    { name: "Contract Management", path: "/our-projects", icon: contractIcon },
    { name: "File Management", path: "/notifications", icon: fileIcon },
    { name: "Settings", path: "/notifications", icon: SettingIcon },
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
      <div className="fixed top-20 md:w-64 w-16 border-r border-gray-300 min-h-screen" style={{ backgroundColor: '#ffbe2a' }}>
      
        <div className="pt-6 flex flex-col">
          {sidebarLinks.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index, item.path)}
              className={`flex items-center py-4 px-6 gap-3 transition-colors duration-200 text-left cursor-pointer
                ${activeIndex === index
                  ? "border-l-4 bg-black/10 border-black text-black font-semibold"
                  : "hover:bg-black/5 text-black"
                }
                ${item.name === "Logout" ? "mt-4" : ""}`}
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <p className="md:block hidden text-base">{item.name}</p>
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