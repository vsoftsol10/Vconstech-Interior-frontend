import React from 'react'
import {  Calendar, Users, IndianRupee,  TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onView, onEdit, onDelete, getStatusColor, getStatusIcon }) => (
  <div className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
          <span className={`flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="hidden xs:inline">{project.status}</span>
          </span>
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {project.type}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">{project.client} • {project.id}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div className="flex items-start gap-2 text-xs sm:text-sm">
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gray-600">Timeline</p>
          <p className="font-medium text-gray-900 truncate">{project.startDate}</p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs sm:text-sm">
        <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gray-600">Budget</p>
          <p className="font-medium text-gray-900 truncate">₹{(project.spent/1000).toFixed(0)}k/₹{(project.budget/1000).toFixed(0)}k</p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs sm:text-sm">
        <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gray-600">Team</p>
          <p className="font-medium text-gray-900">{project.team.length} members</p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs sm:text-sm">
        <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-gray-600">Tasks</p>
          <p className="font-medium text-gray-900">{project.tasks.completed}/{project.tasks.total}</p>
        </div>
      </div>
    </div>

    <div className="mb-3">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-900">{project.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-black h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
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

export default ProjectCard