import React, { useState, useEffect } from 'react';
import { LayoutGrid, Package, DollarSign, FileText, TrendingUp, Calendar, Users, ArrowRight, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import SidePannel from '../../components/common/SidePannel';

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data
  const summaryCards = [
    {
      icon: LayoutGrid,
      title: 'Project Management',
      value: '12 Total Projects',
      subtitle: '4 Ongoing',
      gradient: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Package,
      title: 'Material Management',
      value: '180 Materials',
      subtitle: '12 Updated this week',
      gradient: 'from-amber-400 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      icon: IndianRupee,
      title: 'Financial Management',
      value: '₹12.5L Revenue',
      subtitle: '₹1.2L Pending',
      gradient: 'from-green-400 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Contract Management',
      value: '24 Contracts',
      subtitle: '3 due next week',
      gradient: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  const ongoingProjects = [
    {
      id: 1,
      name: 'Residential Complex A',
      client: 'ABC Developers',
      progress: 75,
      deadline: '2025-12-15',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'
    },
    {
      id: 2,
      name: 'Commercial Plaza B',
      client: 'XYZ Constructions',
      progress: 45,
      deadline: '2026-03-20',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    },
    {
      id: 3,
      name: 'Highway Bridge Project',
      client: 'State PWD',
      progress: 60,
      deadline: '2025-11-30',
      image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400'
    },
    {
      id: 4,
      name: 'Industrial Warehouse',
      client: 'LogiTech Inc',
      progress: 30,
      deadline: '2026-01-10',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400'
    }
  ];

  const chartData = [
    { category: 'Materials', value: 35 },
    { category: 'Labor', value: 30 },
    { category: 'Equipment', value: 20 },
    { category: 'Others', value: 15 }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ongoingProjects.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ongoingProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ongoingProjects.length) % ongoingProjects.length);
  };

  return (
   <div className="min-h-screen pl-5 bg-gray-50">
      {/* Navbar */}
      <nav className=" fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      {/* Side Panel */}
      <aside className=" fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>
            <div className="pt-20 pl-16 md:pl-64 p-4 md:p-15 bg-gray-50 min-h-screen">

      <div className="pt-16  mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Top Section: Summary Cards */}
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

      {/* Middle Section: Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cost Allocation Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Cost Allocation</h2>
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
                <span className="text-gray-700 font-medium">Active Team Members</span>
              </div>
              <span className="text-xl font-bold text-gray-800">48</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-green-600" size={20} />
                <span className="text-gray-700 font-medium">Upcoming Milestones</span>
              </div>
              <span className="text-xl font-bold text-gray-800">7</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-purple-600" size={20} />
                <span className="text-gray-700 font-medium">Pending Approvals</span>
              </div>
              <span className="text-xl font-bold text-gray-800">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Ongoing Projects Carousel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
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

                      <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
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

        {/* Carousel Indicators */}
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
      </div>
    </div>
  );
};

export default Dashboard;