import React, { useState } from 'react';
import { Calendar, IndianRupee, Eye, Edit, Trash2, ChevronDown, Percent, TrendingUp, AlertCircle } from 'lucide-react';
import { projectAPI } from '../../api/projectAPI';
import { getUserRole } from '../../utils/auth';

const ProjectCard = ({ project, onView, onEdit, onDelete, getStatusColor, getStatusIcon, onStatusChange, onProgressUpdate }) => {
  const statusOptions = ['Planning', 'In Progress', 'Completed'];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showProgressSlider, setShowProgressSlider] = useState(false);
  const [tempProgress, setTempProgress] = useState(project.progress || 0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const userRole = getUserRole();
  const isAdmin = userRole === 'Admin';
  const isEngineer = userRole === 'Site_Engineer';

  // Calculate time-based progress for comparison
  const calculateTimeProgress = () => {
    if (!project.startDate || !project.endDate) return 50;
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const timeProgress = calculateTimeProgress();
  const actualProgress = project.progress || 0;
  
  // Determine if ahead/behind schedule
  const progressDiff = actualProgress - timeProgress;
  const isAhead = progressDiff > 10;
  const isBehind = progressDiff < -10;

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === project.status) {
      setIsDropdownOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      if (onStatusChange) {
        await onStatusChange(project.id, newStatus);
      }
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update project status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle progress update
  const handleProgressUpdate = async () => {
    if (tempProgress === project.progress) {
      setShowProgressSlider(false);
      return;
    }

    setIsUpdatingProgress(true);
    try {
      await projectAPI.updateProjectProgress(project.dbId, tempProgress);
      
      // Notify parent to reload projects
      if (onProgressUpdate) {
        await onProgressUpdate();
      }
      
      setShowProgressSlider(false);
      alert(`Progress updated to ${tempProgress}%`);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert(error.error || 'Failed to update progress. You may not have permission to update this project.');
      setTempProgress(project.progress || 0); // Reset to original value
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Check if user can update this project's progress
  const canUpdateProgress = () => {
    if (isAdmin) return true; // Admin can update any project
    if (isEngineer && project.assignedEngineerName) {
      // Engineer can only update if assigned (we'll check on backend too)
      return true; // Backend will enforce the actual check
    }
    return false;
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
            
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isUpdating}
                className={`flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} hover:opacity-80 transition-opacity ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {getStatusIcon(project.status)}
                <span className="hidden xs:inline">{project.status}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[140px]">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                          status === project.status ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        <span className={`flex items-center gap-2`}>
                          {getStatusIcon(status)}
                          {status}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {project.type}
            </span>

            {/* Progress Status Badge */}
            {isAhead && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Ahead</span>
              </span>
            )}
            {isBehind && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Behind</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{project.location} • {project.id}</p>
          {project.assignedEngineerName && (
            <p className="text-xs text-gray-500 mt-1">Engineer: {project.assignedEngineerName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-start gap-2 text-xs sm:text-sm">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-gray-600">Timeline</p>
            <p className="font-medium text-gray-900 truncate">{project.startDate} to {project.endDate}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs sm:text-sm">
          <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-gray-600">Budget</p>
            <p className="font-medium text-gray-900 truncate">₹{(project.spent/1000).toFixed(0)}k/₹{(project.budget/1000).toFixed(0)}k</p>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Progress Section with Update Control */}
      <div className="mb-3 sm:mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1">
            <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
            Actual Progress
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-blue-600">{actualProgress}%</span>
            {canUpdateProgress() && !showProgressSlider && (
              <button
                onClick={() => {
                  setTempProgress(actualProgress);
                  setShowProgressSlider(true);
                }}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${actualProgress}%` }}
          />
        </div>

        {/* Show comparison with time-based progress */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Time-based: {timeProgress}%</span>
          {Math.abs(progressDiff) > 5 && (
            <span className={`font-medium ${isAhead ? 'text-green-600' : isBehind ? 'text-red-600' : 'text-gray-600'}`}>
              {progressDiff > 0 ? '+' : ''}{progressDiff}%
            </span>
          )}
        </div>

        {/* ✅ Progress Update Slider */}
        {showProgressSlider && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">
                Update Progress: {tempProgress}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowProgressSlider(false)}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                  disabled={isUpdatingProgress}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProgressUpdate}
                  disabled={isUpdatingProgress || tempProgress === project.progress}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUpdatingProgress ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tempProgress}
              onChange={(e) => setTempProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled={isUpdatingProgress}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onView(project)} className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">View</span>
        </button>
        <button onClick={() => onEdit(project)} className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Edit</span>
        </button>
        <button onClick={() => onDelete(project.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;