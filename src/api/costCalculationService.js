// src/services/costCalculationService.js
import { financialAPI } from '../api/financialAPI.js';
import { materialAPI } from '../api/materialService.js';
import { projectAPI } from '../api/projectAPI.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vconstech-interior-backend-1.onrender.com/api';

const getAuthToken = () => localStorage.getItem('authToken');

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

/**
 * Unified Cost Calculation Service
 * Aggregates costs from all sources: Financial expenses + Material usage
 */
export const costCalculationService = {
  /**
   * Calculate total spent for a single project
   * @param {number} projectId - Project ID
   * @returns {Object} { totalSpent, breakdown: { financial, materials } }
   */
  calculateProjectSpent: async (projectId) => {
    try {
      const token = getAuthToken();
      
      console.log(`💰 Calculating total spent for project ${projectId}...`);
      
      // 1. Get financial expenses
      let financialSpent = 0;
      try {
        const financialData = await financialAPI.getProjectById(projectId);
        if (financialData.success && financialData.project) {
          // Sum all expenses
          financialSpent = financialData.project.expenses?.reduce(
            (sum, exp) => sum + parseFloat(exp.amount || 0), 
            0
          ) || 0;
        }
      } catch (err) {
        console.warn('No financial data found for project:', projectId);
      }
      
      // 2. Get material costs from usage logs
      let materialSpent = 0;
      try {
        const usageLogs = await materialAPI.usageLogAPI.getByProject(projectId);
        if (usageLogs.success && usageLogs.logs) {
          // Sum: quantity * unit_price for each log
          materialSpent = usageLogs.logs.reduce((sum, log) => {
            const qty = parseFloat(log.quantity || 0);
            const price = parseFloat(log.material?.unit_price || 0);
            return sum + (qty * price);
          }, 0);
        }
      } catch (err) {
        console.warn('No material usage found for project:', projectId);
      }
      
      const totalSpent = financialSpent + materialSpent;
      
      console.log(`✅ Project ${projectId} total spent: ₹${totalSpent.toFixed(2)}`);
      console.log(`   - Financial: ₹${financialSpent.toFixed(2)}`);
      console.log(`   - Materials: ₹${materialSpent.toFixed(2)}`);
      
      return {
        totalSpent,
        breakdown: {
          financial: financialSpent,
          materials: materialSpent
        }
      };
    } catch (error) {
      console.error('Error calculating project spent:', error);
      throw error;
    }
  },

  /**
   * Calculate spent for all projects
   * @returns {Object} Map of projectId -> { totalSpent, breakdown }
   */
  calculateAllProjectsSpent: async () => {
    try {
      const projects = await projectAPI.getProjects();
      const spentMap = {};
      
      // Calculate spent for each project in parallel
      const calculations = projects.projects.map(async (project) => {
        const spent = await costCalculationService.calculateProjectSpent(project.id);
        spentMap[project.id] = spent;
      });
      
      await Promise.all(calculations);
      
      return spentMap;
    } catch (error) {
      console.error('Error calculating all projects spent:', error);
      throw error;
    }
  },

  /**
   * Update project's spent field in database
   * @param {number} projectId - Project ID
   * @returns {Object} Updated project
   */
  updateProjectSpent: async (projectId) => {
    try {
      const token = getAuthToken();
      
      // Calculate current spent
      const { totalSpent, breakdown } = await costCalculationService.calculateProjectSpent(projectId);
      
      // Update project with new spent value
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/spent`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ spent: totalSpent })
      });
      
      const result = await handleResponse(response);
      
      console.log(`✅ Updated project ${projectId} spent to ₹${totalSpent}`);
      
      return result;
    } catch (error) {
      console.error('Error updating project spent:', error);
      throw error;
    }
  },

  /**
   * Get enriched project data with calculated spent
   * @param {number} projectId - Project ID
   * @returns {Object} Project with spent details
   */
  getProjectWithSpent: async (projectId) => {
    try {
      // Get project details
      const projectData = await projectAPI.getProjectById(projectId);
      
      // Calculate spent
      const spentData = await costCalculationService.calculateProjectSpent(projectId);
      
      // Merge data
      return {
        ...projectData.project,
        spent: spentData.totalSpent,
        spentBreakdown: spentData.breakdown,
        budgetUtilization: projectData.project.budget 
          ? ((spentData.totalSpent / projectData.project.budget) * 100).toFixed(2)
          : 0
      };
    } catch (error) {
      console.error('Error getting project with spent:', error);
      throw error;
    }
  },

  /**
   * Get all projects with calculated spent
   * @returns {Array} Projects with spent data
   */
  getAllProjectsWithSpent: async () => {
    try {
      // Get all projects
      const projectsData = await projectAPI.getProjects();
      
      // Calculate spent for all projects in parallel
      const enrichedProjects = await Promise.all(
        projectsData.projects.map(async (project) => {
          try {
            const spentData = await costCalculationService.calculateProjectSpent(project.id);
            return {
              ...project,
              spent: spentData.totalSpent,
              spentBreakdown: spentData.breakdown,
              budgetUtilization: project.budget 
                ? ((spentData.totalSpent / project.budget) * 100).toFixed(2)
                : 0
            };
          } catch (err) {
            console.warn(`Failed to calculate spent for project ${project.id}:`, err);
            // Return project with original spent value if calculation fails
            return {
              ...project,
              spentBreakdown: { financial: 0, materials: 0 },
              budgetUtilization: 0
            };
          }
        })
      );
      
      return enrichedProjects;
    } catch (error) {
      console.error('Error getting all projects with spent:', error);
      throw error;
    }
  }
};

/**
 * Hook to automatically update spent when expenses/usage changes
 * Call this after:
 * - Adding/updating/deleting financial expenses
 * - Adding/updating/deleting material usage logs
 */
export const triggerSpentRecalculation = async (projectId) => {
  try {
    await costCalculationService.updateProjectSpent(projectId);
  } catch (error) {
    console.error('Failed to recalculate spent:', error);
  }
};

export default costCalculationService;