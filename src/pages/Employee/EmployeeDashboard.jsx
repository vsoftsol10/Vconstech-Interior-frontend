import React, { useState } from 'react';
import { Calendar, FileText, Package, AlertCircle, Clock, CheckCircle, Plus, Upload, FolderOpen, AlertTriangle } from 'lucide-react';
import EmployeeNavbar from '../../components/Employee/EmployeeNavbar';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data
  const employeeName = "Rajesh Kumar";
  const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const kpiData = [
    { icon: FolderOpen, label: 'Active Projects', value: '8', color: 'bg-blue-500', trend: '+2 this month' },
    { icon: Calendar, label: "Today's Tasks", value: '5', color: 'bg-green-500', trend: '2 site visits' },
    { icon: Package, label: 'Pending Requests', value: '12', color: 'bg-orange-500', trend: '3 urgent' },
    { icon: AlertCircle, label: 'Notifications', value: '7', color: 'bg-purple-500', trend: '2 new' },
    { icon: Clock, label: 'Working Hours', value: '6.5h', color: 'bg-teal-500', trend: 'Today' },
    { icon: AlertTriangle, label: 'Issues Reported', value: '3', color: 'bg-red-500', trend: '1 critical' }
  ];

  const projects = [
    { id: 1, name: 'Residential Complex - Phase 2', client: 'ABC Builders', progress: 75, stage: 'Electrical', status: 'Active', deadline: '2025-11-15' },
    { id: 2, name: 'Commercial Tower', client: 'XYZ Developers', progress: 45, stage: 'Carpentry', status: 'Active', deadline: '2025-12-20' },
    { id: 3, name: 'Villa Project', client: 'Premium Homes', progress: 90, stage: 'Finishing', status: 'Active', deadline: '2025-10-30' },
    { id: 4, name: 'Industrial Warehouse', client: 'Logistics Inc', progress: 30, stage: 'Civil', status: 'On Hold', deadline: '2026-01-10' }
  ];

  const materialRequests = [
    { id: 1, material: 'Cement - 500 bags', project: 'Residential Complex', date: '2025-10-20', status: 'Pending' },
    { id: 2, material: 'Steel Rods - 2 tons', project: 'Commercial Tower', date: '2025-10-19', status: 'Approved' },
    { id: 3, material: 'Electrical Wiring', project: 'Villa Project', date: '2025-10-21', status: 'Pending' },
    { id: 4, material: 'Paint - 100 liters', project: 'Residential Complex', date: '2025-10-18', status: 'Rejected' },
    { id: 5, material: 'Tiles - 500 sqft', project: 'Commercial Tower', date: '2025-10-22', status: 'Approved' }
  ];

  const recentFiles = [
    { name: 'Floor_Plan_Rev3.pdf', project: 'Residential Complex', uploadedBy: 'PM Sharma', date: '2025-10-22', type: 'PDF' },
    { name: 'Electrical_Layout.dwg', project: 'Commercial Tower', uploadedBy: 'Eng. Patel', date: '2025-10-21', type: 'DWG' },
    { name: 'Site_Photo_1.jpg', project: 'Villa Project', uploadedBy: 'Rajesh Kumar', date: '2025-10-20', type: 'Image' },
    { name: 'Material_Specs.pdf', project: 'Industrial Warehouse', uploadedBy: 'PM Singh', date: '2025-10-19', type: 'PDF' },
    { name: 'Progress_Report.xlsx', project: 'Residential Complex', uploadedBy: 'Eng. Gupta', date: '2025-10-18', type: 'Excel' }
  ];

  const todayTasks = [
    { time: '09:00 AM', task: 'Site Inspection - Villa Project', priority: 'high' },
    { time: '11:30 AM', task: 'Vendor Meeting - Electrical Supplies', priority: 'medium' },
    { time: '02:00 PM', task: 'Progress Review - Commercial Tower', priority: 'high' },
    { time: '04:00 PM', task: 'Material Quality Check', priority: 'low' },
    { time: '05:30 PM', task: 'Team Sync-up Call', priority: 'medium' }
  ];

  const notifications = [
    { type: 'approval', message: 'Steel Rods request approved for Commercial Tower', time: '2 hours ago' },
    { type: 'file', message: 'New floor plan uploaded by PM Sharma', time: '3 hours ago' },
    { type: 'update', message: 'Villa Project moved to finishing stage', time: '5 hours ago' },
    { type: 'rejection', message: 'Paint request rejected - See comments', time: '1 day ago' },
    { type: 'comment', message: 'PM Singh commented on your progress report', time: '1 day ago' }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-green-500 bg-green-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeNavbar/>
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b mt-26 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hello, {employeeName} 👷‍♂️</h1>
              <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                RK
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Project Progress Overview</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Stage</p>
                        <p className="font-medium text-gray-900">{project.stage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Completion</p>
                        <p className="font-medium text-gray-900">{project.progress}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-medium text-gray-900">{new Date(project.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Request Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Material Request Insights</h2>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">✓ 8 Approved</span>
                  <span className="text-orange-600 font-medium">⏳ 12 Pending</span>
                  <span className="text-red-600 font-medium">✗ 3 Rejected</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Material</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Project</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm text-gray-900">{request.material}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{request.project}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{new Date(request.date).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Files */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent File Uploads</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Files</button>
              </div>
              <div className="space-y-3">
                {recentFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                        <p className="text-xs text-gray-600">{file.project} • {file.uploadedBy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{file.date}</p>
                      <span className="text-xs text-gray-400">{file.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {todayTasks.map((task, index) => (
                  <div key={index} className={`p-3 rounded-lg ${getPriorityColor(task.priority)}`}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">{task.time}</p>
                    <p className="text-sm text-gray-900">{task.task}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Notifications</h2>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Raise Material Request</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload File</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <FolderOpen className="w-5 h-5" />
                  <span className="font-medium">View Projects</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;