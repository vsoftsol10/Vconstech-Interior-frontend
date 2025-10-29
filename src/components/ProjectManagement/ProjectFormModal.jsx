import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { projectAPI } from '../../api/projectAPI';

// Project Form Modal Component
const ProjectFormModal = ({ isOpen, onClose, project, onChange, onSubmit, title, submitLabel }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load employees when modal opens
  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      // Set existing file preview if editing
      if (project.designFile) {
        setFilePreview(project.designFile);
      }
      // Clear validation errors when modal opens
      setValidationErrors({});
      setError(null);
    } else {
      // Reset file state when modal closes
      setSelectedFile(null);
      setFilePreview(null);
      setValidationErrors({});
      setError(null);
    }
  }, [isOpen, project.designFile]);

  const loadEmployees = async () => {
    try {
      setError(null);
      const data = await projectAPI.getEmployees();
      console.log('Loaded employees:', data.employees); // Debug log
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Failed to load employees:', err);
      
      // Check if it's an auth error
      if (err.error === 'Invalid or expired token' || err.status === 403) {
        setError('Session expired. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('authToken');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login'; // Adjust path as needed
        }, 2000);
      } else {
        setError('Failed to load site engineers. Please try again.');
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!project.name || project.name.trim() === '') {
      errors.name = 'Project name is required';
    }

    if (!project.id && (!project.projectId || project.projectId.trim() === '')) {
      errors.projectId = 'Project ID is required';
    }

    if (!project.client || project.client.trim() === '') {
      errors.client = 'Client name is required';
    }

    if (!project.location || project.location.trim() === '') {
      errors.location = 'Project location is required';
    }

    if (!project.id && (!project.assignedEmployee || project.assignedEmployee === '')) {
      errors.assignedEmployee = 'Site Engineer assignment is required for new projects';
    }

    // Project ID format validation (only for new projects)
    if (!project.id && project.projectId && !/^[a-zA-Z0-9_-]+$/.test(project.projectId)) {
      errors.projectId = 'Project ID can only contain letters, numbers, dashes, and underscores';
    }

    // Date validation
    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      
      if (end < start) {
        errors.endDate = 'End date must be after start date';
      }
    }

    // Budget validation
    if (project.budget && (isNaN(project.budget) || parseFloat(project.budget) < 0)) {
      errors.budget = 'Budget must be a positive number';
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Pass the selected file to the parent component
      await onSubmit(selectedFile);
      // Parent component will handle success message and modal closing
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || err.error || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (3D design files)
      const validTypes = ['.dwg', '.dxf', '.skp', '.obj', '.fbx', '.3ds', '.stl', '.rvt', '.ifc'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setError('Invalid file type. Please upload a 3D design file (.dwg, .dxf, .skp, .obj, .fbx, .3ds, .stl, .rvt, .ifc)');
        return;
      }

      // Validate file size (e.g., max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size too large. Maximum size is 50MB');
        return;
      }

      setSelectedFile(file);
      setFilePreview(file.name);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    // Also notify parent to clear the file
    onChange({...project, designFile: null});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 sm:mx-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={project.name || ''}
                onChange={(e) => {
                  onChange({...project, name: e.target.value});
                  if (validationErrors.name) {
                    setValidationErrors({...validationErrors, name: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name"
                disabled={loading}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Project ID (only for new projects) */}
            {!project.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={project.projectId || ''}
                  onChange={(e) => {
                    onChange({...project, projectId: e.target.value});
                    if (validationErrors.projectId) {
                      setValidationErrors({...validationErrors, projectId: undefined});
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.projectId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., PRJ005"
                  disabled={loading}
                />
                {validationErrors.projectId && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.projectId}</p>
                )}
              </div>
            )}

            {/* Client Name */}
            <div className={!project.id ? '' : 'sm:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={project.client || ''}
                onChange={(e) => {
                  onChange({...project, client: e.target.value});
                  if (validationErrors.client) {
                    setValidationErrors({...validationErrors, client: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.client ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter client name"
                disabled={loading}
              />
              {validationErrors.client && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.client}</p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select 
                value={project.type || 'Residential'}
                onChange={(e) => onChange({...project, type: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Renovation">Renovation</option>
              </select>
            </div>

            {/* Status (only for existing projects) */}
            {project.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={project.status || 'PENDING'}
                  onChange={(e) => onChange({...project, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="PENDING">Planning</option>
                  <option value="ONGOING">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            )}

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
              <input 
                type="number" 
                value={project.budget || ''}
                onChange={(e) => {
                  onChange({...project, budget: e.target.value});
                  if (validationErrors.budget) {
                    setValidationErrors({...validationErrors, budget: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 150000"
                disabled={loading}
                min="0"
              />
              {validationErrors.budget && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.budget}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                value={project.startDate || ''}
                onChange={(e) => {
                  onChange({...project, startDate: e.target.value});
                  if (validationErrors.endDate) {
                    setValidationErrors({...validationErrors, endDate: undefined});
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                disabled={loading}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                value={project.endDate || ''}
                onChange={(e) => {
                  onChange({...project, endDate: e.target.value});
                  if (validationErrors.endDate) {
                    setValidationErrors({...validationErrors, endDate: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {validationErrors.endDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.endDate}</p>
              )}
            </div>

            {/* Project Location */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={project.location || ''}
                onChange={(e) => {
                  onChange({...project, location: e.target.value});
                  if (validationErrors.location) {
                    setValidationErrors({...validationErrors, location: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project location/address"
                disabled={loading}
              />
              {validationErrors.location && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
              )}
            </div>

            {/* Assign Site Engineer */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Site Engineer {!project.id && <span className="text-red-500">*</span>}
              </label>
              <select 
                value={project.assignedEmployee || ''}
                onChange={(e) => {
                  onChange({...project, assignedEmployee: e.target.value});
                  if (validationErrors.assignedEmployee) {
                    setValidationErrors({...validationErrors, assignedEmployee: undefined});
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.assignedEmployee ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading || employees.length === 0}
              >
                <option value="">Select Site Engineer</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
              {validationErrors.assignedEmployee && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.assignedEmployee}</p>
              )}
              {employees.length === 0 && !error && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span> No site engineers available. Please add site engineers first.
                </p>
              )}
              {employees.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {employees.length} site engineer{employees.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>

            {/* Upload 3D Design File */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload 3D Design File (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                {!filePreview ? (
                  <label className="cursor-pointer block">
                    <input 
                      type="file" 
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".dwg,.dxf,.skp,.obj,.fbx,.3ds,.stl,.rvt,.ifc"
                      disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload 3D design file</p>
                      <p className="text-xs text-gray-500">Supported: DWG, DXF, SKP, OBJ, FBX, 3DS, STL, RVT, IFC (Max 50MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">{filePreview}</span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                      disabled={loading}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea 
                rows="4" 
                value={project.description || ''}
                onChange={(e) => onChange({...project, description: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project..."
                disabled={loading}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={loading || (employees.length === 0 && !project.id)}
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;