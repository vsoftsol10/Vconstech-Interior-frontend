// src/api/projectAPI.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function
const transformStatusToBackend = (status) => {
  const statusMap = {
    'Planning': 'PENDING',
    'In Progress': 'ONGOING',
    'Completed': 'COMPLETED'
  };
  return statusMap[status] || 'PENDING';
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw {
      status: response.status,
      error: data.error || 'An error occurred',
      details: data.details
    };
  }
  
  return data;
};

export const projectAPI = {
  // Get all projects
  getProjects: async (filters = {}) => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.projectType) queryParams.append('projectType', filters.projectType);
    
    const url = `${API_BASE_URL}/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },

  // Get single project
  getProjectById: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },

  // Create project
  createProject: async (projectData, file = null) => {
    const token = getAuthToken();
    
    const body = {
      projectId: projectData.projectId,
      name: projectData.name,
      clientName: projectData.client,
      projectType: projectData.type,
      budget: projectData.budget || null,
      description: projectData.description || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      location: projectData.location || null,
      assignedUserId: projectData.assignedEmployee || null
    };
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const result = await handleResponse(response);
    
    // Upload file if exists
    if (file && result.project) {
      try {
        console.log('Uploading file for project:', result.project.id);
        await projectAPI.uploadFile(result.project.id, file);
        console.log('File uploaded successfully');
      } catch (err) {
        console.error('File upload failed:', err);
        // Project created but file upload failed
        throw new Error(`Project created but file upload failed: ${err.error || err.message}`);
      }
    }
    
    return result;
  },

  // Upload file
  uploadFile: async (projectId, file) => {
    const token = getAuthToken();
    
    console.log('Uploading file:', file.name, 'for project:', projectId);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData
    });
    
    return handleResponse(response);
  },

  // Update project
  updateProject: async (id, projectData, file = null) => {
    const token = getAuthToken();
    
    const body = {
      name: projectData.name,
      clientName: projectData.client,
      projectType: projectData.type,
      budget: projectData.budget || null,
      description: projectData.description || null,
      startDate: projectData.startDate || null,
      endDate: projectData.endDate || null,
      location: projectData.location || null,
      status: projectData.status || null,
      assignedUserId: projectData.assignedEmployee || null
    };
    
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const result = await handleResponse(response);
    
    // ✅ FIXED: Actually upload the file if it exists
    if (file && result.project) {
      try {
        console.log('Uploading new file for project:', result.project.id);
        await projectAPI.uploadFile(result.project.id, file);
        console.log('File uploaded successfully');
      } catch (err) {
        console.error('File upload failed:', err);
        // Project updated but file upload failed
        throw new Error(`Project updated but file upload failed: ${err.error || err.message}`);
      }
    }
    
    return result;
  },

  // Update project status
  updateProjectStatus: async (id, status) => {
    const token = getAuthToken();
    
    // Transform frontend status to backend format
    const statusMap = {
      'Planning': 'PENDING',
      'In Progress': 'ONGOING',
      'Completed': 'COMPLETED'
    };
    const backendStatus = statusMap[status] || status;
    
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: backendStatus })
    });
    
    return handleResponse(response);
  },

  // Delete project
  deleteProject: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },

  // Get employees (Site Engineers)
  getEmployees: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },

  // Get project files
  getProjectFiles: async (projectId) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },

  // Delete project file
  deleteProjectFile: async (projectId, fileId) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  }
};