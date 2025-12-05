import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, DollarSign, FileText, TrendingUp, Calendar, Users, ArrowRight, ChevronLeft, ChevronRight, IndianRupee, AlertCircle, Loader, MapPin, Briefcase } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import SidePannel from '../../components/common/SidePannel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    materials: { metrics: {}, usageLogs: [] },
    financial: { projects: [], summary: {} },
    engineers: [],
    contracts: []
  });

  const API_BASE_URL = 'https://vconstech-interior-backend.onrender.com/api';
  
  const getAuthToken = () => localStorage.getItem('authToken') || localStorage.getItem('token');

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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('No authentication token found. Please login.');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [projectsRes, materialsRes, financialRes, engineersRes, contractsRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/projects`, { headers }).then(handleResponse),
          fetch(`${API_BASE_URL}/materials/dashboard`, { headers }).then(handleResponse),
          fetch(`${API_BASE_URL}/financial/projects`, { headers }).then(handleResponse),
          fetch(`${API_BASE_URL}/employees`, { headers }).then(handleResponse),
          fetch(`${API_BASE_URL}/contracts`, { headers }).then(handleResponse)
        ]);

        const newData = {
          projects: projectsRes.status === 'fulfilled' ? projectsRes.value.projects || [] : [],
          materials: materialsRes.status === 'fulfilled' ? materialsRes.value.data || { metrics: {}, usageLogs: [] } : { metrics: {}, usageLogs: [] },
          financial: financialRes.status === 'fulfilled' ? { projects: financialRes.value.projects || [], count: financialRes.value.count || 0 } : { projects: [], count: 0 },
          engineers: engineersRes.status === 'fulfilled' ? engineersRes.value.employees || [] : [],
          contracts: contractsRes.status === 'fulfilled' ? contractsRes.value.contracts || [] : []
        };

        setDashboardData(newData);
        
        [projectsRes, materialsRes, financialRes, engineersRes, contractsRes].forEach((res, idx) => {
          if (res.status === 'rejected') {
            console.warn(`Failed to fetch data [${idx}]:`, res.reason);
          }
        });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const calculateSummaryCards = () => {
    const ongoingProjects = dashboardData.projects.filter(p => p.status === 'ONGOING' || p.status === 'In Progress');
    const materialsCount = dashboardData.materials.metrics?.totalMaterials || 0;
    const recentMaterialUpdates = dashboardData.materials.usageLogs?.length || 0;
    
    const totalRevenue = dashboardData.financial.projects.reduce((sum, p) => sum + (parseFloat(p.quotationAmount) || 0), 0);
    
    const activeContracts = dashboardData.contracts.filter(c => {
      const status = (c.status || c.workStatus || '').toLowerCase().trim();
      return status === 'in progress' || status === 'inprogress' || status === 'active' || status === 'ongoing';
    }).length;
    
    const totalContractValue = dashboardData.contracts.reduce((sum, c) => {
      return sum + (parseFloat(c.contractValue || c.contractAmount || 0));
    }, 0);
    
    const combinedFinancialTotal = totalRevenue + totalContractValue;
    
    return [
      {
        icon: LayoutGrid,
        title: 'Project Management',
        value: `${dashboardData.projects.length} Total Projects`,
        subtitle: `${ongoingProjects.length} Ongoing`,
        gradient: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600'
      },
      {
        icon: Package,
        title: 'Material Management',
        value: `${materialsCount} Materials`,
        subtitle: `${recentMaterialUpdates} Recent Updates`,
        gradient: 'from-amber-400 to-orange-600',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600'
      },
      {
        icon: IndianRupee,
        title: 'Financial Management',
        value: `₹${(combinedFinancialTotal / 100000).toFixed(1)}L Total`,
        subtitle: `${dashboardData.financial.count || 0} Projects + ${dashboardData.contracts.length} Contracts`,
        gradient: 'from-green-400 to-emerald-600',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        icon: FileText,
        title: 'Contract Management',
        value: `${dashboardData.contracts.length} Contracts`,
        subtitle: `${activeContracts} Active`,
        gradient: 'from-blue-400 to-indigo-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      }
    ];
  };

  const getOngoingProjects = () => {
    return dashboardData.projects
      .filter(p => p.status === 'ONGOING' || p.status === 'In Progress')
      .slice(0, 4)
      .map(project => {
        // ✅ Use actualProgress from database
        const actualProgress = project.actualProgress || 0;
        
        // Calculate time-based progress for comparison
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        const now = new Date();
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const elapsed = (now - start) / (1000 * 60 * 60 * 24);
        const timeProgress = Math.min(Math.max(Math.round((elapsed / totalDays) * 100), 0), 100);

        // Determine if project is ahead, on track, or behind
        const progressStatus = actualProgress > timeProgress + 10 ? 'ahead' : 
                              actualProgress < timeProgress - 10 ? 'behind' : 'ontrack';

        return {
          id: project.id,
          projectId: project.projectId,
          name: project.name,
          client: project.clientName || 'N/A',
          progress: isNaN(actualProgress) ? 0 : actualProgress, // ✅ Use actual progress
          timeProgress: isNaN(timeProgress) ? 50 : timeProgress,
          progressStatus: progressStatus,
          startDate: project.startDate,
          endDate: project.endDate,
          location: project.location || 'Not specified',
          projectType: project.projectType || 'General',
          budget: project.budget,
          description: project.description
        };
      });
  };

  const getCostAllocation = () => {
    const metrics = dashboardData.materials.metrics;
    
    if (!metrics || !metrics.categoryBreakdown) {
      return [
        { category: 'Materials', value: 35 },
        { category: 'Labor', value: 30 },
        { category: 'Equipment', value: 20 },
        { category: 'Others', value: 15 }
      ];
    }

    const total = metrics.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0);
    return metrics.categoryBreakdown.map(cat => ({
      category: cat.category,
      value: total > 0 ? Math.round((cat.count / total) * 100) : 0
    }));
  };

  const getContractStats = () => {
    const activeContracts = dashboardData.contracts.filter(c => {
      const status = (c.status || c.workStatus || '').toLowerCase().trim();
      return status === 'in progress' || status === 'inprogress' || status === 'active' || status === 'ongoing';
    }).length;
    
    const completedContracts = dashboardData.contracts.filter(c => {
      const status = (c.status || c.workStatus || '').toLowerCase().trim();
      return status === 'completed' || status === 'finished' || status === 'closed' || status === 'done';
    }).length;
    
    const pendingContracts = dashboardData.contracts.filter(c => {
      const status = (c.status || c.workStatus || '').toLowerCase().trim();
      return status === 'pending' || status === 'draft' || status === 'awaiting' || status === 'not started';
    }).length;
    
    const totalValue = dashboardData.contracts.reduce((sum, c) => {
      return sum + (parseFloat(c.contractValue || c.contractAmount || 0));
    }, 0);
    
    return {
      active: activeContracts,
      completed: completedContracts,
      pending: pendingContracts,
      totalValue: totalValue,
      total: dashboardData.contracts.length
    };
  };

  useEffect(() => {
    const projects = getOngoingProjects();
    if (projects.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [dashboardData.projects]);

  const nextSlide = () => {
    const projects = getOngoingProjects();
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    const projects = getOngoingProjects();
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-yellow-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const summaryCards = calculateSummaryCards();
  const ongoingProjects = getOngoingProjects();
  const chartData = getCostAllocation();
  const contractStats = getContractStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>
      
      <div className="pt-20 pl-16 md:pl-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${card.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer`}
              >
                <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.iconColor} bg-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{card.value}</p>
                  <p className="text-gray-500 text-sm">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ongoing Projects Carousel */}
        {ongoingProjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Ongoing Projects</h2>
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-400 hover:text-white transition-colors duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-400 hover:text-white transition-colors duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {ongoingProjects.map((project) => (
                  <div key={project.id} className="min-w-full px-2">
                    <div className="bg-gradient-to-br from-yellow-50 via-white to-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-yellow-100">
                      <div className="p-8">
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                {project.projectId}
                              </div>
                              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {project.projectType}
                              </div>
                              {/* ✅ Progress Status Badge */}
                              {project.progressStatus === 'ahead' && (
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <TrendingUp size={12} />
                                  Ahead of Schedule
                                </div>
                              )}
                              {project.progressStatus === 'behind' && (
                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  Behind Schedule
                                </div>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                            {project.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <Users className="text-blue-600 flex-shrink-0" size={20} />
                            <div>
                              <p className="text-xs text-gray-500">Client</p>
                              <p className="text-sm font-semibold text-gray-800">{project.client}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <MapPin className="text-red-600 flex-shrink-0" size={20} />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm font-semibold text-gray-800">{project.location}</p>
                            </div>
                          </div>

                          {project.budget && (
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <IndianRupee className="text-green-600 flex-shrink-0" size={20} />
                              <div>
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  ₹{(project.budget / 100000).toFixed(2)}L
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <Calendar className="text-purple-600 flex-shrink-0" size={20} />
                            <div>
                              <p className="text-xs text-gray-500">Timeline</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ✅ Progress Section - Now shows ACTUAL progress */}
                        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-700 font-semibold">Actual Project Progress</span>
                            <span className="text-yellow-600 font-bold text-lg">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${project.progress}%` }}
                            >
                              {project.progress > 10 && (
                                <span className="text-white text-xs font-bold">{project.progress}%</span>
                              )}
                            </div>
                          </div>
                          {/* ✅ Show time-based progress for comparison */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>Time-based progress: {project.timeProgress}%</span>
                            {project.progressStatus === 'ahead' && (
                              <span className="text-green-600 font-medium">+{project.progress - project.timeProgress}% ahead</span>
                            )}
                            {project.progressStatus === 'behind' && (
                              <span className="text-red-600 font-medium">{project.progress - project.timeProgress}% behind</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => navigate('/project')}
                          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                          View Project Details
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {ongoingProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-yellow-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Contract Statistics</h2>
              <FileText className="text-blue-600" size={24} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-700 font-medium">Total Contracts</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{contractStats.total}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Active Contracts</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{contractStats.active}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Pending Contracts</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{contractStats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <IndianRupee className="text-purple-600" size={20} />
                  <span className="text-gray-700 font-medium">Total Value</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  ₹{(contractStats.totalValue / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Quick Stats</h2>
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600" size={20} />
                  <span className="text-gray-700 font-medium">Active Engineers</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{dashboardData.engineers.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">Total Materials</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {dashboardData.materials.metrics?.totalMaterials || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-purple-600" size={20} />
                  <span className="text-gray-700 font-medium">Total Projects</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {dashboardData.financial.count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;