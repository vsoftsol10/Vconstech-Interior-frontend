import React, { useState, useEffect } from "react";
import { Package, TrendingUp, IndianRupee, Loader2 } from "lucide-react";
import MetricCard from "./MetricCard";
import { materialAPI } from "../../api/materialAPI";

const DashboardTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalMaterials: 0,
      activeMaterials: 0,
      totalCost: 0
    },
    usageLogs: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data from API
      const data = await materialAPI.getDashboardData();
      
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading dashboard</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metrics, usageLogs } = dashboardData;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <MetricCard
          title="Total Materials"
          value={metrics.totalMaterials}
          icon={Package}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Active in Projects"
          value={metrics.activeMaterials}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Total Cost (Used)"
          value={`₹${metrics.totalCost.toLocaleString()}`}
          icon={IndianRupee}
          iconColor="text-emerald-600"
        />
      </div>

      {/* Recent Material Usage Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Recent Material Usage
          </h2>
        </div>
        
        {usageLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No material usage recorded yet</p>
          </div>
        ) : (
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
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usageLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                      {log.projectName}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                      {log.materialName}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-900">
                      {log.quantity} {log.unit}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-700">
                      {log.userName}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-gray-600 break-words max-w-[200px]">
                      {log.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;