import React from "react";
import { Package, TrendingUp, AlertCircle, IndianRupee } from "lucide-react";
import MetricCard from "./MetricCard";

const DashboardTab = ({ metrics, usageLogs, projects, materials }) => (
  <div className="space-y-6 p-4 sm:p-6">
    {/* Metrics Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      
    </div>

    {/* Recent Material Usage Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Recent Material Usage
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usageLogs.slice(0, 5).map((log, idx) => {
              const project = projects.find((p) => p.id === log.projectId);
              const material = materials.find((m) => m.id === log.materialId);
              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                    {log.date}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                    {project?.name || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                    {material?.name || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                    {log.quantity} {material?.unit || ""}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 break-words max-w-[200px]">
                    {log.remarks || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DashboardTab;
