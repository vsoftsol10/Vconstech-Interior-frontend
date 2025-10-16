import React, { useState } from 'react';
import { Plus, Search, Filter,  IndianRupee, FileText,  CheckCircle, Clock, AlertCircle, Menu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SidePannel from '../components/common/SidePannel';
import StatsCard from '../components/ProjectManagement/StatsCard';
import ProjectCard from '../components/ProjectManagement/ProjectCard';
import ProjectFormModal from '../components/ProjectManagement/ProjectFormModal';
import ProjectDetailsModal from '../components/ProjectManagement/ProjectDetailsModal';

// Main Project Management Component
const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  
  const [projects, setProjects] = useState([
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
      tasks: { total: 45, completed: 29 },
      description: 'Complete renovation of a modern villa including interior design and landscaping.'
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
      tasks: { total: 60, completed: 15 },
      description: 'Modern office interior design with open workspace concept.'
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
      tasks: { total: 35, completed: 35 },
      description: 'Luxury retail store interior with premium finishes.'
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
      tasks: { total: 40, completed: 32 },
      description: 'High-end apartment interior with custom furniture.'
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    projectId: '',
    client: '',
    type: 'Residential',
    budget: '',
    startDate: '',
    endDate: '',
    description: ''
  });

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
    const matchesFilter = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesTab && matchesFilter;
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.projectId || !newProject.client) {
      alert('Please fill in all required fields (Name, ID, and Client)');
      return;
    }

    const project = {
      ...newProject,
      id: newProject.projectId,
      budget: parseFloat(newProject.budget) || 0,
      spent: 0,
      status: 'Planning',
      progress: 0,
      team: [],
      tasks: { total: 0, completed: 0 }
    };

    setProjects([...projects, project]);
    setShowNewProjectModal(false);
    setNewProject({
      name: '',
      projectId: '',
      client: '',
      type: 'Residential',
      budget: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    alert('Project created successfully!');
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
  };

  const handleUpdateProject = () => {
    if (!editingProject.name || !editingProject.client) {
      alert('Please fill in all required fields');
      return;
    }

    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    setShowEditModal(false);
    if (selectedProject && selectedProject.id === editingProject.id) {
      setSelectedProject(editingProject);
    }
    setEditingProject(null);
    alert('Project updated successfully!');
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(projects.filter(p => p.id !== projectId));
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
      alert('Project deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>

      <div className="mt-26 pl-16 md:pl-64 min-h-screen">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
          <div className="flex items-center gap-3">
            <button className="text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Projects</h1>
          </div>
          <button onClick={() => setShowNewProjectModal(true)} className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New</span>
          </button>
        </div>

        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all your interior design projects</p>
            </div>
            <button onClick={() => setShowNewProjectModal(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatsCard icon={FileText} label="Total Projects" value={stats.total} bgColor="bg-blue-100" iconColor="text-blue-600" />
            <StatsCard icon={Clock} label="In Progress" value={stats.inProgress} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
            <StatsCard icon={CheckCircle} label="Completed" value={stats.completed} bgColor="bg-green-100" iconColor="text-green-600" />
            <StatsCard icon={IndianRupee} label="Total Budget" value={`₹${(stats.totalBudget / 1000).toFixed(0)}k`} bgColor="bg-purple-100" iconColor="text-purple-600" />
          </div>

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
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {filterType !== 'all' && (
                      <span className="bg-blue-500 text-white rounded-full w-2 h-2"></span>
                    )}
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-600 px-2 py-1">Filter by Type</p>
                        {['all', 'Residential', 'Commercial', 'Office', 'Renovation'].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setFilterType(type);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm ${
                              filterType === type ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                          >
                            {type === 'all' ? 'All Types' : type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="divide-y divide-gray-200">
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No projects found</p>
                </div>
              ) : (
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onView={setSelectedProject}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <ProjectFormModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          project={newProject}
          onChange={setNewProject}
          onSubmit={handleCreateProject}
          title="Create New Project"
          submitLabel="Create Project"
        />

        <ProjectFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          project={editingProject || {}}
          onChange={setEditingProject}
          onSubmit={handleUpdateProject}
          title="Edit Project"
          submitLabel="Update Project"
        />

        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          onQuickAction={(action) => alert(`${action} feature will be available soon!`)}
        />
      </div>
    </div>
  );
};

export default ProjectManagement