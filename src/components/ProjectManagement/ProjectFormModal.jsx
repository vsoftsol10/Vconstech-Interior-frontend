import React from 'react'
import {  X} from 'lucide-react';

// Project Form Modal Component
const ProjectFormModal = ({ isOpen, onClose, project, onChange, onSubmit, title, submitLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input 
                type="text" 
                value={project.name}
                onChange={(e) => onChange({...project, name: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter project name"
              />
            </div>
            {!project.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project ID *</label>
                <input 
                  type="text" 
                  value={project.projectId || ''}
                  onChange={(e) => onChange({...project, projectId: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g., PRJ005"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
              <input 
                type="text" 
                value={project.client}
                onChange={(e) => onChange({...project, client: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select 
                value={project.type}
                onChange={(e) => onChange({...project, type: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Residential</option>
                <option>Commercial</option>
                <option>Office</option>
                <option>Renovation</option>
              </select>
            </div>
            {project.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={project.status}
                  onChange={(e) => onChange({...project, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
              <input 
                type="number" 
                value={project.budget}
                onChange={(e) => onChange({...project, budget: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g., 150000"
              />
            </div>
            {project.id && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spent (₹)</label>
                  <input 
                    type="number" 
                    value={project.spent}
                    onChange={(e) => onChange({...project, spent: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={project.progress}
                    onChange={(e) => onChange({...project, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                value={project.startDate}
                onChange={(e) => onChange({...project, startDate: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                value={project.endDate}
                onChange={(e) => onChange({...project, endDate: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea 
                rows="4" 
                value={project.description || ''}
                onChange={(e) => onChange({...project, description: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project..."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
            Cancel
          </button>
          <button onClick={onSubmit} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal