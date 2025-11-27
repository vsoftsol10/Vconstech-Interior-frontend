import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, DollarSign, FileText, TrendingUp, Calendar, Users, ArrowRight, ChevronLeft, ChevronRight, IndianRupee, AlertCircle, Loader } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import SidePannel from '../../components/common/SidePannel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for all dashboard data
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    materials: { metrics: {}, usageLogs: [] },
    financial: { projects: [], summary: {} },
    engineers: []
  });

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  
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

  // Fetch all dashboard data
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

        // Fetch all data in parallel
        const [projectsRes, materialsRes, financialRes, engineersRes] = await Promise.allSettled([
          // Projects
          fetch(`${API_BASE_URL}/projects`, { headers }).then(handleResponse),
          
          // Materials Dashboard
          fetch(`${API_BASE_URL}/materials/dashboard`, { headers }).then(handleResponse),
          
          // Financial Projects
          fetch(`${API_BASE_URL}/financial/projects`, { headers }).then(handleResponse),
          
          // Engineers
          fetch(`${API_BASE_URL}/employees`, { headers }).then(handleResponse)
        ]);

        // Process results
        const newData = {
          projects: projectsRes.status === 'fulfilled' ? projectsRes.value.projects || [] : [],
          materials: materialsRes.status === 'fulfilled' ? materialsRes.value.data || { metrics: {}, usageLogs: [] } : { metrics: {}, usageLogs: [] },
          financial: financialRes.status === 'fulfilled' ? { projects: financialRes.value.projects || [], count: financialRes.value.count || 0 } : { projects: [], count: 0 },
          engineers: engineersRes.status === 'fulfilled' ? engineersRes.value.employees || [] : []
        };

        setDashboardData(newData);
        
        // Log any failures
        [projectsRes, materialsRes, financialRes, engineersRes].forEach((res, idx) => {
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

  // Calculate summary cards data from fetched data
  const calculateSummaryCards = () => {
    const ongoingProjects = dashboardData.projects.filter(p => p.status === 'ONGOING' || p.status === 'In Progress');
    const materialsCount = dashboardData.materials.metrics?.totalMaterials || 0;
    const recentMaterialUpdates = dashboardData.materials.usageLogs?.length || 0;
    
    // Calculate financial totals
    const totalRevenue = dashboardData.financial.projects.reduce((sum, p) => sum + (parseFloat(p.quotationAmount) || 0), 0);
    const totalPending = dashboardData.financial.projects.reduce((sum, p) => sum + (parseFloat(p.pendingAmount) || 0), 0);
    
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
        value: `₹${(totalRevenue / 100000).toFixed(1)}L Revenue`,
        gradient: 'from-green-400 to-emerald-600',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        icon: FileText,
        title: 'Contract Management',
        value: `${dashboardData.financial.count || 0} Contracts`,
        subtitle: `${dashboardData.engineers.length} Engineers`,
        gradient: 'from-blue-400 to-indigo-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      }
    ];
  };

  // Prepare ongoing projects with real data
  const getOngoingProjects = () => {
    return dashboardData.projects
      .filter(p => p.status === 'ONGOING' || p.status === 'In Progress')
      .slice(0, 4)
      .map(project => {
        // Calculate progress based on dates
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        const now = new Date();
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const elapsed = (now - start) / (1000 * 60 * 60 * 24);
        const progress = Math.min(Math.max(Math.round((elapsed / totalDays) * 100), 0), 100);

        return {
          id: project.id,
          name: project.name,
          client: project.clientName || 'N/A',
          progress: isNaN(progress) ? 50 : progress,
          deadline: project.endDate,
          image: project.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'
        };
      });
  };

  // Calculate cost allocation from materials
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

    // Convert category breakdown to percentage
    const total = metrics.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0);
    return metrics.categoryBreakdown.map(cat => ({
      category: cat.category,
      value: total > 0 ? Math.round((cat.count / total) * 100) : 0
    }));
  };

  // Auto-rotate carousel
  useEffect(() => {
    const projects = getOngoingProjects();
    if (projects.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 4000);
    
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

  // Loading state
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

  // Error state
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
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="md:flex">
                        <div className="md:w-2/5">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-3/5">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                          <p className="text-gray-600 mb-4 flex items-center gap-2">
                            <Users size={16} />
                            {project.client}
                          </p>

                          <div className="mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-700 font-medium">Progress</span>
                              <span className="text-yellow-600 font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mb-6">
                            <Calendar size={16} />
                            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                          </div>

                          <button 
                            onClick={() => navigate('/project')}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                          >
                            View Details
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
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
          {/* Cost Allocation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Material Distribution</h2>
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{item.category}</span>
                    <span className="text-gray-600">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Quick Stats</h2>
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600" size={20} />
                  <span className="text-gray-700 font-medium">Active Engineers</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{dashboardData.engineers.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">Total Materials</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {dashboardData.materials.metrics?.totalMaterials || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-600" size={20} />
                  <span className="text-gray-700 font-medium">Financial Projects</span>
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