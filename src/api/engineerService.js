// src/services/engineerService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Check if token is expired
const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return expiry < Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Clear auth data and redirect to login
const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token and check expiry
api.interceptors.request.use(
  (config) => {
    // Check if token is expired before making request
    if (isTokenExpired()) {
      handleAuthError();
      return Promise.reject({ error: 'Session expired. Please login again.' });
    }
    
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleAuthError();
      return Promise.reject({ 
        error: 'Session expired. Please login again.',
        expired: true 
      });
    }
    return Promise.reject(error);
  }
);

// Get all engineers
export const getAllEngineers = async () => {
  try {
    const response = await api.get('/engineers');
    return response.data;
  } catch (error) {
    throw error.response?.data || error || { error: 'Failed to fetch engineers' };
  }
};

// Get single engineer
export const getEngineerById = async (id) => {
  try {
    const response = await api.get(`/engineers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error || { error: 'Failed to fetch engineer' };
  }
};

// Create new engineer
export const createEngineer = async (engineerData) => {
  try {
    // Check token before creating FormData
    if (isTokenExpired()) {
      handleAuthError();
      throw { error: 'Session expired. Please login again.' };
    }

    const formData = new FormData();
    
    formData.append('name', engineerData.name);
    formData.append('phone', engineerData.phone);
    formData.append('empId', engineerData.empId);
    formData.append('address', engineerData.address);
    
    if (engineerData.alternatePhone) {
      formData.append('alternatePhone', engineerData.alternatePhone);
    }
    
    if (engineerData.profileImage) {
      formData.append('profileImage', engineerData.profileImage);
    }

    const response = await axios.post(`${API_URL}/engineers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleAuthError();
      throw { error: 'Session expired. Please login again.' };
    }
    throw error.response?.data || error || { error: 'Failed to create engineer' };
  }
};

// Update engineer
export const updateEngineer = async (id, engineerData) => {
  try {
    if (isTokenExpired()) {
      handleAuthError();
      throw { error: 'Session expired. Please login again.' };
    }

    const formData = new FormData();
    
    formData.append('name', engineerData.name);
    formData.append('phone', engineerData.phone);
    formData.append('empId', engineerData.empId);
    formData.append('address', engineerData.address);
    
    if (engineerData.alternatePhone) {
      formData.append('alternatePhone', engineerData.alternatePhone);
    }
    
    if (engineerData.profileImage && typeof engineerData.profileImage !== 'string') {
      formData.append('profileImage', engineerData.profileImage);
    }

    const response = await axios.put(`${API_URL}/engineers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleAuthError();
      throw { error: 'Session expired. Please login again.' };
    }
    throw error.response?.data || error || { error: 'Failed to update engineer' };
  }
};

// Delete engineer
export const deleteEngineer = async (id) => {
  try {
    const response = await api.delete(`/engineers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error || { error: 'Failed to delete engineer' };
  }
};

export default {
  getAllEngineers,
  getEngineerById,
  createEngineer,
  updateEngineer,
  deleteEngineer,
};