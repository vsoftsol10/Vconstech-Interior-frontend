// src/api/materialAPI.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { getAuthToken } from '../utils/auth';

// Helper to handle API responses
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

export const materialAPI = {
  /**
   * Get dashboard data (metrics + recent usage logs)
   * @returns {Object} { metrics: {...}, usageLogs: [...] }
   */
  getDashboardData: async () => {
    const token = getAuthToken();
    
    console.log('🌐 Fetching dashboard data...');
    
    const response = await fetch(`${API_BASE_URL}/materials/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response);
    console.log('📥 Dashboard data:', result);
    return result.data;
  },

  /**
   * Get all materials
   * @returns {Array} List of materials
   */
  getMaterials: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response);
    return result.materials;
  },

  /**
   * Get material usage statistics
   * @param {Object} filters - { projectId?, materialId?, startDate?, endDate? }
   * @returns {Array} Usage statistics
   */
  getUsageStats: async (filters = {}) => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (filters.projectId) queryParams.append('projectId', filters.projectId);
    if (filters.materialId) queryParams.append('materialId', filters.materialId);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const url = `${API_BASE_URL}/materials/usage-stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response);
    return result.stats;
  },

  /**
   * Get project-wise material usage summary
   * @returns {Array} Project usage summary
   */
  getProjectSummary: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/materials/project-summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response);
    return result.summary;
  }
};