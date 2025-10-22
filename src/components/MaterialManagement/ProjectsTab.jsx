import React from "react";

// Projects Tab Component
const ProjectsTab = ({
  projects,
  selectedProject,
  setSelectedProject,
  projectMaterials,
  materialRequests,
  onAddProjectMaterial,
  onLogUsage,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [selectedRequestId, setSelectedRequestId] = React.useState(null);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      const request = materialRequests.find(r => r.id === selectedRequestId);
      if (request && request.onReject) {
        request.onReject(selectedRequestId, rejectReason);
      }
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedRequestId(null);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedRequestId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Top Section */}
      <div className="bg-white rounded-lg md:rounded-xl shadow p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          {/* Select Project with Search */}
          <div className="flex-1 w-full relative" ref={dropdownRef}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Select Project
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={selectedProjectData ? `${selectedProjectData.name} - ${selectedProjectData.status}` : "Search projects..."}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectSelect(project.id)}
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          project.id === selectedProject ? "bg-blue-100" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{project.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{project.status}</div>
                          </div>
                          {project.id === selectedProject && (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 text-xs sm:text-sm text-center">
                      No projects found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Materials Allocated Table */}
      <div className="bg-white rounded-lg md:rounded-xl shadow overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
            Materials Allocated
          </h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Project Name",
                  "Material",
                  "Used",
                  "Cost",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectMaterials.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No materials allocated yet
                  </td>
                </tr>
              ) : (
                projectMaterials.map((pm, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 lg:px-6 py-3 text-gray-900 font-medium text-sm">
                      {pm.projectName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {pm.material?.name}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 whitespace-nowrap text-sm">
                      {pm.used} {pm.material?.unit}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 font-semibold whitespace-nowrap text-sm">
                      ₹{((pm.material?.defaultRate || 0) * pm.used).toLocaleString()}
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          pm.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : pm.status === "Completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pm.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {projectMaterials.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No materials allocated yet
            </div>
          ) : (
            projectMaterials.map((pm, idx) => (
              <div key={idx} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{pm.projectName}</div>
                    <div className="text-gray-600 text-sm mt-0.5">{pm.material?.name}</div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                      pm.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : pm.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {pm.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used:</span>
                  <span className="text-gray-900 font-medium">{pm.used} {pm.material?.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost:</span>
                  <span className="text-gray-900 font-semibold">₹{((pm.material?.defaultRate || 0) * pm.used).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Material Requests Table */}
      <div className="bg-white rounded-lg md:rounded-xl shadow overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
            Material Requests
          </h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Engineer", "Project Name", "Material Requested", "Quantity", "Status", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 lg:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs whitespace-nowrap"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materialRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No material requests yet
                  </td>
                </tr>
              ) : (
                materialRequests.map((request, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 lg:px-6 py-3 text-gray-900 font-medium text-sm">
                      {request.engineerName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {request.projectName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {request.materialName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 whitespace-nowrap text-sm">
                      {request.quantity} {request.unit}
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          request.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      {request.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => request.onAccept && request.onAccept(request.id)}
                            className="px-3 py-1.5 bg-[#ffbe2a] text-black text-xs font-medium rounded-lg hover:bg-[#e6ab25] transition-colors whitespace-nowrap"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectClick(request.id)}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {request.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {materialRequests.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No material requests yet
            </div>
          ) : (
            materialRequests.map((request, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{request.engineerName}</div>
                    <div className="text-gray-600 text-sm mt-0.5">{request.projectName}</div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                      request.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="text-gray-900 font-medium">{request.materialName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="text-gray-900 font-medium">{request.quantity} {request.unit}</span>
                  </div>
                </div>
                {request.status === "Pending" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => request.onAccept && request.onAccept(request.id)}
                      className="flex-1 px-3 py-2 bg-[#ffbe2a] text-black text-sm font-medium rounded-lg hover:bg-[#e6ab25] transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectClick(request.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Reject Material Request
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Please provide a reason for rejecting this material request:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
              rows="4"
              autoFocus
            />
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleRejectCancel}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sample data for demonstration
const SampleApp = () => {
  const [selectedProject, setSelectedProject] = React.useState("proj-001");
  const [materialRequests, setMaterialRequests] = React.useState([
    {
      id: "req-001",
      engineerName: "Rajesh Kumar",
      projectName: "Building A Construction",
      materialName: "Cement",
      quantity: 50,
      unit: "bags",
      status: "Accepted",
    },
    {
      id: "req-002",
      engineerName: "Priya Sharma",
      projectName: "Road Extension Project",
      materialName: "Bitumen",
      quantity: 1000,
      unit: "liters",
      status: "Pending",
    },
    {
      id: "req-003",
      engineerName: "Amit Patel",
      projectName: "Building A Construction",
      materialName: "Steel Rods",
      quantity: 500,
      unit: "kg",
      status: "Accepted",
    },
    {
      id: "req-004",
      engineerName: "Sneha Reddy",
      projectName: "Bridge Repair",
      materialName: "Sand",
      quantity: 20,
      unit: "tons",
      status: "Rejected",
      rejectionReason: "Insufficient stock available",
    },
    {
      id: "req-005",
      engineerName: "Vikram Singh",
      projectName: "Road Extension Project",
      materialName: "Gravel",
      quantity: 30,
      unit: "tons",
      status: "Pending",
    },
  ]);

  const projects = [
    { id: "proj-001", name: "Building A Construction", status: "Active" },
    { id: "proj-002", name: "Road Extension Project", status: "Active" },
    { id: "proj-003", name: "Bridge Repair", status: "Completed" },
  ];

  const projectMaterials = [
    {
      projectName: "Building A Construction",
      material: { name: "Cement", unit: "bags", defaultRate: 450 },
      used: 150,
      status: "Active",
    },
    {
      projectName: "Building A Construction",
      material: { name: "Steel Rods", unit: "kg", defaultRate: 65 },
      used: 2500,
      status: "Active",
    },
    {
      projectName: "Road Extension Project",
      material: { name: "Bitumen", unit: "liters", defaultRate: 85 },
      used: 5000,
      status: "Active",
    },
    {
      projectName: "Bridge Repair",
      material: { name: "Concrete Mix", unit: "cubic meters", defaultRate: 3500 },
      used: 45,
      status: "Completed",
    },
  ];

  // Handle accept request
  const handleAcceptRequest = (requestId) => {
    setMaterialRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "Accepted" } : req
      )
    );
  };

  // Handle reject request with reason
  const handleRejectRequest = (requestId, reason) => {
    setMaterialRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "Rejected", rejectionReason: reason } : req
      )
    );
  };

  // Add handlers to material requests
  const enrichedMaterialRequests = materialRequests.map(req => ({
    ...req,
    onAccept: handleAcceptRequest,
    onReject: handleRejectRequest,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectsTab
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projectMaterials={projectMaterials}
        materialRequests={enrichedMaterialRequests}
      />
    </div>
  );
};

export default SampleApp;