import React, { useEffect, useRef, useState } from "react";
import { materialRequestAPI, projectMaterialAPI, materialAPI } from '../../api/materialService';
import { projectAPI } from "../../api/projectAPI";

// Projects Tab Component
const ProjectsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const dropdownRef = useRef(null);
  const [requestStatusFilter, setRequestStatusFilter] = useState("All");
  const [materials, setMaterials] = useState([]); // ✅ ADD THIS LINE
  // Add Material Modal States
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    materialId: "",
    quantity: "",
  });
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Status Update Modal States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Data States
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMaterials, setProjectMaterials] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredMaterialRequests = requestStatusFilter === "All" 
    ? materialRequests 
    : materialRequests.filter(req => req.status === requestStatusFilter);

useEffect(() => {
  fetchProjects();
  fetchMaterialRequests();
  fetchMaterials(); // ✅ ADD THIS LINE
}, []);

  // Fetch project materials when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchProjectMaterials(selectedProject);
    }
  }, [selectedProject]);

  // ✅ ADD THIS ENTIRE FUNCTION
const fetchMaterials = async () => {
  try {
    const data = await materialAPI.getAll();
    if (data.projects || data.success) {
      setMaterials(data.materials || []);
      console.log('Materials fetched:', data.materials);
    }
  } catch (err) {
    console.error('Error fetching materials:', err);
  }
};

const fetchProjects = async () => {
  try {
    setLoading(true);
    const data = await projectAPI.getProjects();
    
    console.log('🔍 Raw projects data:', data);
    console.log('🔍 data.success:', data.success);
    console.log('🔍 data.projects:', data.projects);
    
    // ✅ FIX: Check for projects array directly, not just success flag
    if (data.projects && Array.isArray(data.projects)) {
      console.log('📋 Projects array from API:', data.projects);
      console.log('📋 Projects count from API:', data.projects.length);
      
      setProjects(data.projects);
      console.log('✅ setProjects called with:', data.projects.length, 'projects');
      
      if (data.projects.length > 0) {
        console.log('✅ First project:', data.projects[0]);
        console.log('✅ Setting selected project to:', data.projects[0].id);
        setSelectedProject(data.projects[0].id);
      }
    } else {
      console.error('❌ No projects array in response');
    }
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    setError('Failed to load projects');
  } finally {
    setLoading(false);
  }
};

  const fetchProjectMaterials = async (projectId) => {
    try {
      setLoading(true);
      const data = await projectMaterialAPI.getByProject(projectId);
      if (data.success) {
        setProjectMaterials(data.projectMaterials || []);
      }
    } catch (err) {
      console.error('Error fetching project materials:', err);
      setError('Failed to load project materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching all material requests...');
      
      const data = await materialRequestAPI.getAll();
      
      console.log('Received data:', data);
      
      if (data.success) {
        console.log('Material requests count:', data.count);
        console.log('Material requests:', data.requests);
        setMaterialRequests(data.requests || []);
      } else {
        console.error('Failed to fetch requests:', data.error);
        setError(data.error || 'Failed to load material requests');
      }
    } catch (err) {
      console.error('Error fetching material requests:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Failed to load material requests');
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


// ✅ FIX: Ensure projects array exists before filtering
const filteredProjects = React.useMemo(() => {
  console.log('🔄 Recalculating filtered projects, projects:', projects);
  
  if (!projects || projects.length === 0) {
    return [];
  }
  
  if (searchTerm.trim() === "") {
    return projects;
  }
  
  return projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    const name = (project.name || '').toLowerCase();
    const status = (project.status || '').toLowerCase();
    return name.includes(searchLower) || status.includes(searchLower);
  });
}, [projects, searchTerm]);

console.log('🔎 Search term:', searchTerm);
console.log('📊 Filtered projects:', filteredProjects);
console.log('🔎 Search term:', searchTerm); // ✅ ADD THIS
console.log('📊 Filtered projects:', filteredProjects); // ✅ ADD THIS

  const selectedProjectData = projects.find(p => p.id === selectedProject);
console.log('🏗️ Projects state:', projects);
console.log('🏗️ Projects length:', projects.length);
  // Filter project materials by status
  const filteredProjectMaterials = statusFilter === "All" 
    ? projectMaterials 
    : projectMaterials.filter(pm => pm.status === statusFilter);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };
  
  const handleAddMaterial = async () => {
    if (newMaterial.materialId && newMaterial.quantity && selectedProject) {
      try {
        await projectMaterialAPI.add({
          projectId: selectedProject,
          materialId: parseInt(newMaterial.materialId),
          assigned: parseFloat(newMaterial.quantity)
        });
        
        setShowAddMaterialModal(false);
        setNewMaterial({ materialId: "", quantity: "" });
        fetchProjectMaterials(selectedProject);
      } catch (err) {
        console.error('Error adding material:', err);
        alert('Failed to add material');
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const result = await materialRequestAPI.approve(requestId, 'Request approved');
      console.log('Approve result:', result);
      fetchMaterialRequests();
      if (selectedProject) {
        fetchProjectMaterials(selectedProject);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to accept request: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectModal(true);
    setRejectReason("");
  };

  const handleRejectConfirm = async () => {
    if (rejectReason.trim() && selectedRequestId) {
      try {
        const result = await materialRequestAPI.reject(selectedRequestId, rejectReason);
        console.log('Reject result:', result);
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequestId(null);
        fetchMaterialRequests();
      } catch (err) {
        console.error('Error rejecting request:', err);
        console.error('Error response:', err.response?.data);
        alert(`Failed to reject request: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedRequestId(null);
  };
  
  const handleStatusUpdateClick = (index) => {
    const materialToUpdate = filteredProjectMaterials[index];
    setSelectedMaterialIndex(projectMaterials.indexOf(materialToUpdate));
    setNewStatus(materialToUpdate.status);
    setShowStatusModal(true);
  };
  
  const handleStatusUpdateConfirm = async () => {
    if (selectedMaterialIndex !== null && newStatus) {
      try {
        const material = projectMaterials[selectedMaterialIndex];
        await projectMaterialAPI.update(material.id, { status: newStatus });
        
        setShowStatusModal(false);
        setSelectedMaterialIndex(null);
        setNewStatus("");
        
        if (selectedProject) {
          fetchProjectMaterials(selectedProject);
        }
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update status');
      }
    }
  };
  
  const handleStatusUpdateCancel = () => {
    setShowStatusModal(false);
    setSelectedMaterialIndex(null);
    setNewStatus("");
  };

  return (
    <div className="space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Top Section */}
      <div className="bg-white rounded-lg md:rounded-xl shadow p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
        
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
          
          {/* Add Material Button - ✅ ADMIN CAN MANUALLY ADD MATERIALS */}
          <button
            onClick={() => setShowAddMaterialModal(true)}
            disabled={!selectedProject}
            className="w-full sm:w-auto px-4 py-2 bg-[#ffbe2a] text-black text-sm font-medium rounded-lg hover:bg-[#e6ab25] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Material
          </button>
        </div>
      </div>

      {/* Materials Allocated Table - ✅ SHOWS MANUALLY ADDED MATERIALS */}
      <div className="bg-white rounded-lg md:rounded-xl shadow overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
            Materials Allocated
          </h2>
          
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {["All", "ACTIVE", "COMPLETED", "NOT_USED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "NOT_USED" ? "Not Used" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Project Name",
                  "Material",
                  "Assigned",
                  "Used",
                  "Cost",
                  "Status",
                  "Action",
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : filteredProjectMaterials.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    {statusFilter === "All" ? "No materials allocated yet" : `No ${statusFilter.toLowerCase()} materials found`}
                  </td>
                </tr>
              ) : (
                filteredProjectMaterials.map((pm, idx) => (
                  <tr
                    key={pm.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 lg:px-6 py-3 text-gray-900 font-medium text-sm">
                      {pm.project?.name || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {pm.material?.name || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 whitespace-nowrap text-sm">
                      {pm.assigned} {pm.material?.unit}
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
                          pm.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : pm.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : pm.status === "NOT_USED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pm.status === "NOT_USED" ? "Not Used" : pm.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <button
                        onClick={() => handleStatusUpdateClick(idx)}
                        className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-medium rounded-lg hover:bg-yellow-400 transition-colors whitespace-nowrap"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : filteredProjectMaterials.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              {statusFilter === "All" ? "No materials allocated yet" : `No ${statusFilter.toLowerCase()} materials found`}
            </div>
          ) : (
            filteredProjectMaterials.map((pm, idx) => (
              <div key={pm.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{pm.project?.name || 'N/A'}</div>
                    <div className="text-gray-600 text-sm mt-0.5">{pm.material?.name || 'N/A'}</div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                      pm.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : pm.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : pm.status === "NOT_USED"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pm.status === "NOT_USED" ? "Not Used" : pm.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="text-gray-900 font-medium">{pm.assigned} {pm.material?.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used:</span>
                  <span className="text-gray-900 font-medium">{pm.used} {pm.material?.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost:</span>
                  <span className="text-gray-900 font-semibold">₹{((pm.material?.defaultRate || 0) * pm.used).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleStatusUpdateClick(idx)}
                  className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Material Requests Table - ✅ ADMIN CAN ACCEPT/REJECT REQUESTS */}
      <div className="bg-white rounded-lg md:rounded-xl shadow overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3">
            Material Requests
          </h2>
          <div className="flex gap-2 flex-wrap">
            {["All", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setRequestStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  requestStatusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : filteredMaterialRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 lg:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No material requests yet
                  </td>
                </tr>
              ) : (
                filteredMaterialRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 lg:px-6 py-3 text-gray-900 font-medium text-sm">
                      {request.employee?.name || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {request.project?.name || request.projectName || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 text-sm">
                      {request.name}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-900 whitespace-nowrap text-sm">
                      {request.quantity || 'N/A'} {request.unit}
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          request.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : request.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3">
                      {request.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
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
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : filteredMaterialRequests.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No material requests yet
            </div>
          ) : (
            filteredMaterialRequests.map((request) => (
              <div key={request.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{request.employee?.name || 'N/A'}</div>
                    <div className="text-gray-600 text-sm mt-0.5">{request.project?.name || request.projectName || 'N/A'}</div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 flex-shrink-0 ${
                      request.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : request.status === "REJECTED"
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
                    <span className="text-gray-900 font-medium">{request.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="text-gray-900 font-medium">{request.quantity || 'N/A'} {request.unit}</span>
                  </div>
                </div>
                {request.status === "PENDING" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
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
      
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Update Material Status
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Material: <span className="font-medium">
                {selectedMaterialIndex !== null ? projectMaterials[selectedMaterialIndex]?.material?.name : ""}
              </span>
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <div className="space-y-2">
                {["ACTIVE", "COMPLETED", "NOT_USED"].map((status) => (
                  <label 
                    key={status} 
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={newStatus === status}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-900">
                      {status === "NOT_USED" ? "Not Used" : status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                    <span 
                      className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                        status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : status === "COMPLETED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {status === "NOT_USED" ? "Not Used" : status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 mt-6">
              <button
                onClick={handleStatusUpdateCancel}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdateConfirm}
                disabled={!newStatus}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Material Modal - ✅ ADMIN CAN MANUALLY ADD MATERIALS */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Add Material to Project
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Project: <span className="font-medium">{selectedProjectData?.name}</span>
            </p>
            
            <div className="space-y-4">
              {/* Material Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Material
                </label>
                <select
  value={newMaterial.materialId}
  onChange={(e) => setNewMaterial({ ...newMaterial, materialId: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
>
  <option value="">Choose a material...</option>
  {materials.length === 0 ? (
    <option disabled>Loading materials...</option>
  ) : (
    materials.map((material) => (
      <option key={material.id} value={material.id}>
        {material.name} ({material.unit})
      </option>
    ))
  )}
</select>
              </div>
              
              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddMaterialModal(false);
                  setNewMaterial({ materialId: "", quantity: "" });
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                disabled={!newMaterial.materialId || !newMaterial.quantity}
                className="flex-1 px-3 sm:px-4 py-2 bg-[#ffbe2a] text-black text-sm font-medium rounded-lg hover:bg-[#e6ab25] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;