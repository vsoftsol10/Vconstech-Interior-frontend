import React, { useState } from 'react';
import { Calendar, IndianRupee, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';

const ProjectCard = ({ project, onView, onEdit, onDelete, getStatusColor, getStatusIcon, onStatusChange }) => {
  // Static status options matching your database enum
  const statusOptions = ['Planning', 'In Progress', 'Completed'];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === project.status) {
      setIsDropdownOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      // Call parent callback to update the project
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

              {/* Dropdown Menu */}
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
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{project.location} • {project.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-start gap-2 text-xs sm:text-sm">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-gray-600">Timeline</p>
            <p className="font-medium text-gray-900 truncate">{project.startDate}  - to -   {project.endDate}</p>
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