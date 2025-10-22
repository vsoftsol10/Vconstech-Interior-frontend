import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, X, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import EmployeeMaterialsTab from '../../components/Employee/EmployeeMaterial/EmployeeMaterialsTab';
import EmployeeProjectsTab from '../../components/Employee/EmployeeMaterial/EmployeeProjectsTab';
import EmployeeRequestTab from '../../components/Employee/EmployeeMaterial/EmployeeRequestTab';
import EmployeeModalMaterial from '../../components/Employee/EmployeeMaterial/EmployeeModalMaterial';
import EmployeeMaterialForm from '../../components/Employee/EmployeeMaterial/EmployeeMaterialForm';
import EmployeeNavbar from '../../components/Employee/EmployeeNavbar';

// Main Component
const EmployeeMaterialManagement = () => {
  const [materials, setMaterials] = useState([
    { id: 'MAT001', name: 'Asian Paints Premium', category: 'Paint', unit: 'liter', defaultRate: 450, vendor: 'Asian Paints', description: 'Premium interior paint' },
    { id: 'MAT002', name: 'Teak Wood Plywood', category: 'Wood', unit: 'sheet', defaultRate: 2800, vendor: 'Century Ply', description: '8mm marine plywood' },
    { id: 'MAT003', name: 'Ceramic Tiles', category: 'Flooring', unit: 'sq.ft', defaultRate: 65, vendor: 'Kajaria', description: 'Vitrified tiles 2x2' },
    { id: 'MAT004', name: 'LED Lights', category: 'Electrical', unit: 'piece', defaultRate: 350, vendor: 'Philips', description: '12W panel lights' },
  ]);

  const [projects, setProjects] = useState([
    { id: 'PRJ001', name: 'Residential - Adyar', status: 'Active' },
    { id: 'PRJ002', name: 'Office - OMR', status: 'Active' },
    { id: 'PRJ003', name: 'Villa - ECR', status: 'Completed' },
  ]);

  const [projectMaterials, setProjectMaterials] = useState([
    { projectId: 'PRJ001', materialId: 'MAT001', assigned: 50, used: 20, status: 'Active' },
    { projectId: 'PRJ001', materialId: 'MAT002', assigned: 15, used: 15, status: 'Completed' },
    { projectId: 'PRJ001', materialId: 'MAT003', assigned: 1200, used: 800, status: 'Active' },
    { projectId: 'PRJ002', materialId: 'MAT001', assigned: 30, used: 5, status: 'Active' },
    { projectId: 'PRJ002', materialId: 'MAT004', assigned: 25, used: 0, status: 'Not Used' },
  ]);

  const [usageLogs, setUsageLogs] = useState([
    { date: '2025-10-10', projectId: 'PRJ001', materialId: 'MAT001', quantity: 20, remarks: 'For Living Room wall' },
    { date: '2025-10-12', projectId: 'PRJ001', materialId: 'MAT002', quantity: 5, remarks: 'For kitchen cabinets' },
    { date: '2025-10-13', projectId: 'PRJ001', materialId: 'MAT003', quantity: 400, remarks: 'Master bedroom flooring' },
  ]);

  // Material Requests State
  const [materialRequests, setMaterialRequests] = useState([
    {
      id: 'REQ001',
      name: 'Premium Wall Putty',
      category: 'Paint',
      unit: 'kilogram',
      defaultRate: 85,
      vendor: 'Birla White',
      description: 'White cement based wall putty',
      type: 'global',
      status: 'approved',
      requestDate: '2025-10-15',
      reviewDate: '2025-10-16',
      approvalNotes: 'Good quality material, approved for use'
    },
    {
      id: 'REQ002',
      name: 'Designer Fabric',
      category: 'Fabric',
      unit: 'meter',
      defaultRate: 450,
      vendor: 'Lifestyle Fabrics',
      description: 'Premium curtain fabric',
      type: 'project',
      projectId: 'PRJ001',
      projectName: 'Residential - Adyar',
      quantity: 50,
      status: 'rejected',
      requestDate: '2025-10-18',
      reviewDate: '2025-10-19',
      rejectionReason: 'Budget exceeded, please find alternative within ₹300/meter range'
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your request for Premium Wall Putty has been approved', type: 'success', date: '2025-10-16', read: false },
    { id: 2, message: 'Your request for Designer Fabric has been rejected', type: 'error', date: '2025-10-19', read: false }
  ]);

  const [activeTab, setActiveTab] = useState('materials');
  const [selectedProject, setSelectedProject] = useState('PRJ001');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddProjectMaterial, setShowAddProjectMaterial] = useState(false);
  const [showUsageLog, setShowUsageLog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestType, setRequestType] = useState('global'); // 'global' or 'project'

  const categories = ['All', 'Paint', 'Wood', 'Flooring', 'Electrical', 'Fabric', 'Hardware', 'Plumbing'];

  const [newMaterial, setNewMaterial] = useState({
    name: '', category: 'Paint', unit: 'piece', defaultRate: '', vendor: '', description: '', projectId: '', quantity: ''
  });

  const [newProjectMaterial, setNewProjectMaterial] = useState({
    materialId: '', assigned: '', used: 0, status: 'Active'
  });

  const [newUsageLog, setNewUsageLog] = useState({
    date: new Date().toISOString().split('T')[0], materialId: '', quantity: '', remarks: ''
  });

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getProjectMaterialsWithDetails = (projectId) => {
    return projectMaterials
      .filter(pm => pm.projectId === projectId)
      .map(pm => ({
        ...pm,
        material: materials.find(m => m.id === pm.materialId),
        remaining: pm.assigned - pm.used
      }));
  };

  const getProjectUsageLogs = (projectId) => {
    return usageLogs
      .filter(log => log.projectId === projectId)
      .map(log => ({
        ...log,
        material: materials.find(m => m.id === log.materialId)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleSubmitMaterialRequest = () => {
    const newRequest = {
      id: `REQ${String(materialRequests.length + 1).padStart(3, '0')}`,
      ...newMaterial,
      type: requestType,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      projectName: requestType === 'project' ? projects.find(p => p.id === newMaterial.projectId)?.name : null
    };
    
    setMaterialRequests([newRequest, ...materialRequests]);
    
    // Add notification for request submission
    const notification = {
      id: notifications.length + 1,
      message: `Material request for "${newMaterial.name}" has been submitted for approval`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications([notification, ...notifications]);
    
    setNewMaterial({ name: '', category: 'Paint', unit: 'piece', defaultRate: '', vendor: '', description: '', projectId: '', quantity: '' });
    setShowAddMaterial(false);
    alert('Material request submitted successfully! You will be notified once it is reviewed.');
  };

  const handleAddProjectMaterial = () => {
    const newRequest = {
      id: `REQ${String(materialRequests.length + 1).padStart(3, '0')}`,
      materialId: newProjectMaterial.materialId,
      material: materials.find(m => m.id === newProjectMaterial.materialId),
      assigned: newProjectMaterial.assigned,
      used: newProjectMaterial.used,
      type: 'project-material',
      projectId: selectedProject,
      projectName: projects.find(p => p.id === selectedProject)?.name,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    setMaterialRequests([newRequest, ...materialRequests]);
    
    const notification = {
      id: notifications.length + 1,
      message: `Request to add material to project "${newRequest.projectName}" submitted`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications([notification, ...notifications]);
    
    setNewProjectMaterial({ materialId: '', assigned: '', used: 0, status: 'Active' });
    setShowAddProjectMaterial(false);
    alert('Project material request submitted successfully!');
  };

  const handleAddUsageLog = () => {
    setUsageLogs([...usageLogs, {
      ...newUsageLog,
      projectId: selectedProject,
      quantity: parseInt(newUsageLog.quantity)
    }]);
    
    const currentPM = projectMaterials.find(pm => 
      pm.projectId === selectedProject && pm.materialId === newUsageLog.materialId
    );
    if (currentPM) {
      setProjectMaterials(projectMaterials.map(pm => 
        pm.projectId === selectedProject && pm.materialId === newUsageLog.materialId
          ? { ...pm, used: pm.used + parseInt(newUsageLog.quantity) }
          : pm
      ));
    }

    setNewUsageLog({ date: new Date().toISOString().split('T')[0], materialId: '', quantity: '', remarks: '' });
    setShowUsageLog(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EmployeeNavbar/>
      <div className="bg-white border-b mt-26 border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Material Management System</h1>
            <p className="text-sm text-gray-600 mt-1">Track and manage materials across all projects</p>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            notif.type === 'success' ? 'bg-green-500' :
                            notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {['materials', 'projects', 'my-requests'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'my-requests' ? 'My Requests' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'materials' && (
          <EmployeeMaterialsTab
            materials={filteredMaterials}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            categories={categories}
            onAddMaterial={() => {
              setRequestType('global');
              setShowAddMaterial(true);
            }}
          />
        )}

        {activeTab === 'projects' && (
          <EmployeeProjectsTab
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projectMaterials={getProjectMaterialsWithDetails(selectedProject)}
            usageLogs={getProjectUsageLogs(selectedProject)}
            onAddProjectMaterial={() => setShowAddProjectMaterial(true)}
            onLogUsage={() => setShowUsageLog(true)}
          />
        )}

        {activeTab === 'my-requests' && (
          <EmployeeRequestTab
            requests={materialRequests}
          />
        )}
      </div>

      {/* Add Global/Project Material Modal */}
      <EmployeeModalMaterial
        isOpen={showAddMaterial}
        onClose={() => {
          setShowAddMaterial(false);
          setNewMaterial({ name: '', category: 'Paint', unit: 'piece', defaultRate: '', vendor: '', description: '', projectId: '', quantity: '' });
        }}
        title={requestType === 'global' ? 'Request New Global Material' : 'Request Project-Specific Material'}
        footer={
          <>
            <button
              onClick={() => {
                setShowAddMaterial(false);
                setNewMaterial({ name: '', category: 'Paint', unit: 'piece', defaultRate: '', vendor: '', description: '', projectId: '', quantity: '' });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitMaterialRequest}
              disabled={!newMaterial.name || !newMaterial.defaultRate || (requestType === 'project' && (!newMaterial.projectId || !newMaterial.quantity))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="global"
                checked={requestType === 'global'}
                onChange={(e) => {
                  setRequestType(e.target.value);
                  setNewMaterial({ ...newMaterial, projectId: '', quantity: '' });
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Global Material (Available for all projects)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="project"
                checked={requestType === 'project'}
                onChange={(e) => setRequestType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Project-Specific Material</span>
            </label>
          </div>
        </div>
        
        <EmployeeMaterialForm
          material={newMaterial}
          onChange={setNewMaterial}
          categories={categories}
          isProjectSpecific={requestType === 'project'}
          projects={projects}
        />
      </EmployeeModalMaterial>

      {/* Add Existing Material to Project Modal */}
      <EmployeeModalMaterial
        isOpen={showAddProjectMaterial}
        onClose={() => {
          setShowAddProjectMaterial(false);
          setNewProjectMaterial({ materialId: '', assigned: '', used: 0, status: 'Active' });
        }}
        title="Request to Add Material to Project"
        footer={
          <>
            <button
              onClick={() => {
                setShowAddProjectMaterial(false);
                setNewProjectMaterial({ materialId: '', assigned: '', used: 0, status: 'Active' });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProjectMaterial}
              disabled={!newProjectMaterial.materialId || !newProjectMaterial.assigned}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This request will be sent to your supervisor for approval before the material is added to the project.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Material <span className="text-red-500">*</span>
            </label>
            <select
              value={newProjectMaterial.materialId}
              onChange={(e) => setNewProjectMaterial({...newProjectMaterial, materialId: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a material...</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category} - ₹{m.defaultRate}/{m.unit})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={newProjectMaterial.assigned}
                onChange={(e) => setNewProjectMaterial({...newProjectMaterial, assigned: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Used Quantity</label>
              <input
                type="number"
                value={newProjectMaterial.used}
                onChange={(e) => setNewProjectMaterial({...newProjectMaterial, used: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </EmployeeModalMaterial>

      {/* Add Usage Log Modal */}
      <EmployeeModalMaterial
        isOpen={showUsageLog}
        onClose={() => {
          setShowUsageLog(false);
          setNewUsageLog({ date: new Date().toISOString().split('T')[0], materialId: '', quantity: '', remarks: '' });
        }}
        title="Log Material Usage"
        footer={
          <>
            <button
              onClick={() => {
                setShowUsageLog(false);
                setNewUsageLog({ date: new Date().toISOString().split('T')[0], materialId: '', quantity: '', remarks: '' });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUsageLog}
              disabled={!newUsageLog.materialId || !newUsageLog.quantity}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Usage
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={newUsageLog.date}
              onChange={(e) => setNewUsageLog({...newUsageLog, date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Material</label>
            <select
              value={newUsageLog.materialId}
              onChange={(e) => setNewUsageLog({...newUsageLog, materialId: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a material...</option>
              {getProjectMaterialsWithDetails(selectedProject).map(pm => (
                <option key={pm.materialId} value={pm.materialId}>
                  {pm.material?.name} (Remaining: {pm.remaining} {pm.material?.unit})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Used</label>
            <input
              type="number"
              value={newUsageLog.quantity}
              onChange={(e) => setNewUsageLog({...newUsageLog, quantity: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              value={newUsageLog.remarks}
              onChange={(e) => setNewUsageLog({...newUsageLog, remarks: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., For Living Room wall"
            />
          </div>
        </div>
      </EmployeeModalMaterial>
    </div>
  );
};

export default EmployeeMaterialManagement;