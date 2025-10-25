
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Project API functions
export const projectAPI = {
  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', {
        projectId: projectData.projectId,
        name: projectData.name,
        clientName: projectData.client,
        projectType: projectData.type,
        budget: projectData.budget,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        assignedUserId: projectData.assignedEmployee
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all projects
  getAllProjects: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/projects?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single project
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, {
        name: projectData.name,
        clientName: projectData.client,
        projectType: projectData.type,
        budget: projectData.budget,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: projectData.status,
        assignedUserId: projectData.assignedEmployee
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get employees for dropdown (Site Engineers)
  getEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default projectAPI;