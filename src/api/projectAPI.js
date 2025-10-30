// src/api/projectAPI.js
const API_BASE_URL = import.meta.env.VITE_API_URL|| 'http://localhost:5000/api';

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

  // Create new project
  createProject: async (projectData, file = null) => {
    const token = getAuthToken();
    
    // Prepare the request body
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
    
    // TODO: If file exists, upload it separately
    // This would require a separate file upload endpoint
    if (file && result.project) {
      console.log('File upload will be implemented with file endpoint');
    }
    
    return result;
  },

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
    
    // TODO: If file exists, upload it separately
    if (file && result.project) {
      console.log('File upload will be implemented with file endpoint');
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
  
};