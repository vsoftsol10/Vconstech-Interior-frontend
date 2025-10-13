import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Users, DollarSign, FileText, TrendingUp, MoreVertical, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, IndianRupee, X, Menu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SidePannel from '../components/common/SidePannel';

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample project data
  const projects = [
    {
      id: 'PRJ001',
      name: 'Modern Villa Renovation',
      client: 'John Smith',
      type: 'Residential',
      status: 'In Progress',
      progress: 65,
      budget: 150000,
      spent: 97500,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      team: ['Alice', 'Bob', 'Charlie'],
      tasks: { total: 45, completed: 29 }
    },
    {
      id: 'PRJ002',
      name: 'Corporate Office Interior',
      client: 'Tech Corp Ltd',
      type: 'Office',
      status: 'Planning',
      progress: 25,
      budget: 250000,
      spent: 62500,
      startDate: '2024-10-01',
      endDate: '2025-02-28',
      team: ['David', 'Emma'],
      tasks: { total: 60, completed: 15 }
    },
    {
      id: 'PRJ003',
      name: 'Retail Store Design',
      client: 'Fashion Hub',
      type: 'Commercial',
      status: 'Completed',
      progress: 100,
      budget: 80000,
      spent: 78000,
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      team: ['Frank', 'Grace'],
      tasks: { total: 35, completed: 35 }
    },
    {
      id: 'PRJ004',
      name: 'Luxury Apartment',
      client: 'Sarah Johnson',
      type: 'Residential',
      status: 'In Progress',
      progress: 80,
      budget: 120000,
      spent: 96000,
      startDate: '2024-08-15',
      endDate: '2024-11-30',
      team: ['Henry', 'Iris'],
      tasks: { total: 40, completed: 32 }
    }
  ];

  // Stats calculation
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    planning: projects.filter(p => p.status === 'Planning').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Planning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'In Progress': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Planning': return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return null;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || project.status.toLowerCase().replace(' ', '-') === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      {/* Side Panel */}
      <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>

      {/* Main Content */}
      <div className="mt-26 pl-16 md:pl-64 min-h-screen">

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Projects</h1>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">New</span>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track all your interior design projects</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Projects</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Budget</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalBudget / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Tabs - Horizontal scroll on mobile */}
          <div className="flex gap-2 px-3 sm:px-4 py-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'planning', label: 'Planning' },
              { id: 'completed', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects List */}
          <div className="divide-y divide-gray-200">
            {filteredProjects.map(project => (
              <div key={project.id} className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors">
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
                  <button className="text-gray-400 hover:text-gray-600 ml-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
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
                    <div
                      className="bg-black h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">View</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Edit</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create New Project</h2>
              <button onClick={() => setShowNewProjectModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                  <input type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Office</option>
                    <option>Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
                  <input type="number" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                  <textarea rows="4" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedProject.name}</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Project ID: {selectedProject.id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Client</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{selectedProject.client}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                    {getStatusIcon(selectedProject.status)}
                    {selectedProject.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Progress</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{selectedProject.progress}%</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Timeline</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{selectedProject.startDate} to {selectedProject.endDate}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Budget</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">₹{selectedProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Spent</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">₹{selectedProject.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Team Members</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{selectedProject.team.join(', ')}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    View Tasks
                  </button>
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    Materials
                  </button>
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    Documents
                  </button>
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    Financials
                  </button>
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    Reports
                  </button>
                  <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium">
                    Team Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProjectManagement;