import React from 'react'

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, iconColor, valueColor = "text-gray-900" }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold ${valueColor} mt-2`}>{value}</p>
      </div>
      <Icon className={`w-12 h-12 ${iconColor}`} />
    </div>
  </div>
);
export default MetricCard