import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Printer, Plus, Save, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import SidePannel from '../components/common/SidePannel';
const FinancialManagement = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Office Renovation',
      budget: 50000,
      dueDate: '2025-12-31',
      quotationAmount: 48000,
      expenses: [
        { id: 1, category: 'Interior Design', amount: 15000, description: 'Modern office interior setup' },
        { id: 2, category: 'Furniture', amount: 12000, description: 'Ergonomic chairs and desks' },
        { id: 3, category: 'Lighting', amount: 8000, description: 'LED lighting installation' },
        { id: 4, category: 'Flooring', amount: 13000, description: 'Vinyl flooring for entire office' }
      ]
    },
    {
      id: 2,
      name: 'Retail Store Setup',
      budget: 75000,
      dueDate: '2025-11-15',
      quotationAmount: 72000,
      expenses: [
        { id: 1, category: 'Interior Design', amount: 25000, description: 'Retail space design and planning' },
        { id: 2, category: 'Display Units', amount: 18000, description: 'Custom display shelving' },
        { id: 3, category: 'Signage', amount: 12000, description: 'Interior and exterior signage' },
        { id: 4, category: 'Lighting', amount: 17000, description: 'Track lighting and spotlights' }
      ]
    }
  ]);

  const [expandedCard, setExpandedCard] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    budget: '',
    dueDate: '',
    quotationAmount: '',
    expenses: []
  });

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleEditExpense = (projectId, expense) => {
    setEditingExpense({ projectId, ...expense });
  };

  const handleSaveExpense = () => {
    setProjects(projects.map(project => {
      if (project.id === editingExpense.projectId) {
        return {
          ...project,
          expenses: project.expenses.map(exp =>
            exp.id === editingExpense.id ? {
              id: exp.id,
              category: editingExpense.category,
              amount: parseFloat(editingExpense.amount),
              description: editingExpense.description
            } : exp
          )
        };
      }
      return project;
    }));
    setEditingExpense(null);
  };

  const handlePrint = (project) => {
    const printWindow = window.open('', '_blank');
    const totalSpent = project.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = project.budget - totalSpent;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Project Financial Report - ${project.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .summary { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .summary-item { display: flex; justify-content: space-between; padding: 8px 0; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #1e40af; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Project Financial Report</h1>
          <h2>${project.name}</h2>
          <p><strong>Due Date:</strong> ${new Date(project.dueDate).toLocaleDateString()}</p>
          
          <div class="summary">
            <div class="summary-item">
              <span>Budget:</span>
              <span>₹${project.budget.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span>Quotation Amount:</span>
              <span>₹${project.quotationAmount.toLocaleString()}</span>
            </div>
            <div class="summary-item">
              <span>Total Spent:</span>
              <span>₹${totalSpent.toLocaleString()}</span>
            </div>
            <div class="summary-item total">
              <span>Remaining:</span>
              <span style="color: ${remaining >= 0 ? '#059669' : '#dc2626'}">₹${remaining.toLocaleString()}</span>
            </div>
          </div>

          <h2>Expense Details</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${project.expenses.map(exp => `
                <tr>
                  <td>${exp.category}</td>
                  <td>${exp.description}</td>
                  <td>₹${exp.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <script>window.print(); window.onafterprint = () => window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAddProject = () => {
    if (newProject.name && newProject.budget && newProject.dueDate && newProject.quotationAmount) {
      const project = {
        id: projects.length + 1,
        name: newProject.name,
        budget: parseFloat(newProject.budget),
        dueDate: newProject.dueDate,
        quotationAmount: parseFloat(newProject.quotationAmount),
        expenses: []
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', budget: '', dueDate: '', quotationAmount: '', expenses: [] });
      setShowAddProject(false);
    }
  };

  const calculateTotalSpent = (expenses) => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
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
                Financial Management
              </h1>
              <button
                onClick={() => setShowAddProject(true)}
                className="flex items-center justify-center gap-2 bg-[#FFbe2a] text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#f5b621] transition-colors shadow-lg w-full sm:w-auto"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {/* Add Project Modal */}
            {showAddProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-black max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Project</h2>
                    <button 
                      onClick={() => setShowAddProject(false)} 
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                      <input
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Enter budget amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Amount</label>
                      <input
                        type="number"
                        value={newProject.quotationAmount}
                        onChange={(e) => setNewProject({ ...newProject, quotationAmount: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Enter quotation amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={handleAddProject}
                      className="w-full bg-[#FFbe2a] text-black font-semibold py-3 rounded-lg hover:bg-[#f5b621] transition-colors"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects List */}
            <div className="space-y-4">
              {projects.map((project) => {
                const totalSpent = calculateTotalSpent(project.expenses);
                const remaining = project.budget - totalSpent;
                const isExpanded = expandedCard === project.id;

                return (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
                    {/* Card Header - Collapsible */}
                    <div
                      onClick={() => toggleCard(project.id)}
                      className="p-4 sm:p-6 cursor-pointer hover:bg-amber-50 transition-colors"
                    >
                      <div className="flex justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 truncate">
                            {project.name}
                          </h2>
                          <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-8 text-xs sm:text-sm space-y-2 sm:space-y-0">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Budget:</span>
                              <span className="font-semibold text-gray-800">₹{project.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Due:</span>
                              <span className="font-semibold text-gray-800">
                                {new Date(project.dueDate).toLocaleDateString('en-IN', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Spent:</span>
                              <span className="font-semibold text-gray-800">₹{totalSpent.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-amber-600 flex-shrink-0">
                          {isExpanded ? <ChevronUp size={24} className="sm:w-7 sm:h-7" /> : <ChevronDown size={24} className="sm:w-7 sm:h-7" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t-2 border-gray-200 bg-amber-50">
                        {/* Financial Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 mb-4 sm:mb-6">
                          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Quotation Amount</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{project.quotationAmount.toLocaleString()}</p>
                          </div>
                          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Spent</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</p>
                          </div>
                          <div className={`bg-white p-3 sm:p-4 rounded-lg shadow-md sm:col-span-2 lg:col-span-1`}>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Remaining Budget</p>
                            <p className={`text-xl sm:text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              ₹{remaining.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Expense Section Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Expense Breakdown</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrint(project);
                            }}
                            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-md w-full sm:w-auto"
                          >
                            <Printer size={18} />
                            <span>Print Report</span>
                          </button>
                        </div>

                        {/* Expenses List */}
                        <div className="space-y-3">
                          {project.expenses.map((expense) => (
                            <div key={expense.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                              {editingExpense && editingExpense.id === expense.id && editingExpense.projectId === project.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={editingExpense.category}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
                                    placeholder="Category"
                                  />
                                  <input
                                    type="text"
                                    value={editingExpense.description}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
                                    placeholder="Description"
                                  />
                                  <input
                                    type="number"
                                    value={editingExpense.amount}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm"
                                    placeholder="Amount"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleSaveExpense}
                                      className="flex-1 flex items-center justify-center gap-1 bg-[#ffbe2a] text-[#000000] px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                      <Save size={16} />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingExpense(null)}
                                      className="flex-1 flex items-center justify-center gap-1 bg-[#000] text-[#ffbe2a] px-4 py-2 rounded-lg hover:bg-[#000]-600 transition-colors text-sm font-medium"
                                    >
                                      <X size={16} />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                      <span className="bg-[#FFbe2a] text-black px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                        {expense.category}
                                      </span>
                                      <span className="text-lg sm:text-xl font-bold text-gray-800">₹{expense.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 break-words">{expense.description}</p>
                                  </div>
                                  <button
                                    onClick={() => handleEditExpense(project.id, expense)}
                                    className="flex items-center gap-1 text-black-600 hover:text-blue-700 transition-colors font-medium text-sm self-start sm:self-auto"
                                  >
                                    <Edit2 size={16} className="sm:w-5 sm:h-5" />
                                    <span>Edit</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;