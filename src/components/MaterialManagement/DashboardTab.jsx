import React from 'react'
import {  Package, TrendingUp, AlertCircle, IndianRupee } from 'lucide-react';
import MetricCard from './MetricCard';

// Dashboard Tab Component
const DashboardTab = ({ metrics, usageLogs, projects, materials }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Total Materials"
        value={metrics.totalMaterials}
        icon={Package}
        iconColor="text-black-600"
      />
      <MetricCard
        title="Active in Projects"
        value={metrics.activeMaterials}
        icon={TrendingUp}
        iconColor="text-green-400"
      />
      <MetricCard
        title="Total Cost (Used)"
        value={`₹${metrics.totalCost.toLocaleString()}`}
        icon={IndianRupee}
        iconColor="text-green-600"
      />
      <MetricCard
        title="Overused Materials"
        value={metrics.overusedMaterials}
        icon={AlertCircle}
        iconColor="text-red-600"
        valueColor="text-red-600"
      />
    </div>

    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Material Usage</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usageLogs.slice(0, 5).map((log, idx) => {
              const project = projects.find(p => p.id === log.projectId);
              const material = materials.find(m => m.id === log.materialId);
              return (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.quantity} {material?.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DashboardTab