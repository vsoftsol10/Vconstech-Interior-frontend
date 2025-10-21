import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Save, X, IndianRupee } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SidePannel from '../components/common/SidePannel';
export default function ContractManagement() {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      projectName: 'Highway Construction',
      contractorName: 'ABC Builders Ltd',
      contactNumber: '+1-555-0123',
      contractAmount: 2500000,
      workStatus: 'In Progress'
    },
    {
      id: 2,
      projectName: 'Shopping Mall Development',
      contractorName: 'XYZ Construction Co',
      contactNumber: '+1-555-0456',
      contractAmount: 5000000,
      workStatus: 'Completed'
    },
    {
      id: 3,
      projectName: 'Bridge Renovation',
      contractorName: 'BuildPro Inc',
      contactNumber: '+1-555-0789',
      contractAmount: 1800000,
      workStatus: 'Pending'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newContract, setNewContract] = useState({
    projectName: '',
    contractorName: '',
    contactNumber: '',
    contractAmount: '',
    workStatus: 'Pending'
  });

  const handleEdit = (contract) => {
    setEditingId(contract.id);
    setEditForm({ ...contract });
  };

  const handleSave = (id) => {
    setContracts(contracts.map(c => c.id === id ? editForm : c));
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  const handleAddNew = () => {
    if (newContract.projectName && newContract.contractorName && newContract.contactNumber && newContract.contractAmount) {
      const contract = {
        id: Math.max(...contracts.map(c => c.id)) + 1,
        ...newContract,
        contractAmount: parseFloat(newContract.contractAmount)
      };
      setContracts([...contracts, contract]);
      setNewContract({
        projectName: '',
        contractorName: '',
        contactNumber: '',
        contractAmount: '',
        workStatus: 'Pending'
      });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className=" fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      {/* Side Panel */}
      <aside className="bg-ambefixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>
      {/* Main Content with proper spacing for navbar and sidebar */}
      <div className="pt-25 pl-16 md:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Contract Management
              </h1>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 bg-[#FFbe2a] text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#f5b621] transition-colors shadow-lg w-full sm:w-auto"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add New Contract</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

          {/* Add New Contract Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-black max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">New Contract Details</h2>
                  <button 
                    onClick={() => setShowAddForm(false)} 
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={newContract.projectName}
                      onChange={(e) => setNewContract({ ...newContract, projectName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contractor Name</label>
                    <input
                      type="text"
                      placeholder="Contractor Name"
                      value={newContract.contractorName}
                      onChange={(e) => setNewContract({ ...newContract, contractorName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={newContract.contactNumber}
                      onChange={(e) => setNewContract({ ...newContract, contactNumber: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Amount</label>
                    <input
                      type="number"
                      placeholder="Contract Amount"
                      value={newContract.contractAmount}
                      onChange={(e) => setNewContract({ ...newContract, contractAmount: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Status</label>
                    <select
                      value={newContract.workStatus}
                      onChange={(e) => setNewContract({ ...newContract, workStatus: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleAddNew}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FFbe2a] text-black font-semibold px-4 py-3 rounded-lg hover:bg-[#f5b621] transition-colors"
                  >
                    <Save size={18} />
                    Add Contract
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Project Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Contractor Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Contact Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Contract Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Work Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition">
                    {editingId === contract.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.projectName}
                            onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.contractorName}
                            onChange={(e) => setEditForm({ ...editForm, contractorName: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editForm.contactNumber}
                            onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editForm.contractAmount}
                            onChange={(e) => setEditForm({ ...editForm, contractAmount: parseFloat(e.target.value) })}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editForm.workStatus}
                            onChange={(e) => setEditForm({ ...editForm, workStatus: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSave(contract.id)}
                              className="bg-[#FFbe2a] text-black p-2 rounded hover:bg-[#f5b621] transition"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-900">{contract.projectName}</td>
                        <td className="px-4 py-3 text-gray-700">{contract.contractorName}</td>
                        <td className="px-4 py-3 text-gray-700">{contract.contactNumber}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">
                        ₹ {contract.contractAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contract.workStatus)}`}>
                            {contract.workStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(contract)}
                              className="bg-[#FFbe2a] text-black p-2 rounded hover:bg-[#FFbe2a] transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(contract.id)}
                              className="bg-black text-[#ffbe2a] p-2 rounded hover:bg-red-700 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="text-gray-600 text-sm">
            Total Contracts: <span className="font-semibold text-gray-800">{contracts.length}</span>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}