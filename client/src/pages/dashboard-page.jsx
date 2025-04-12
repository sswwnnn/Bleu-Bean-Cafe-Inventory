import { useAuth } from "../hooks/use-auth.jsx";
import { useQuery } from "@tanstack/react-query";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { useState } from "react";

// MetricCard component
function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// LowStockItem component
function LowStockItem({ name, category, currentStock, minStock }) {
  const percentage = (currentStock / minStock) * 100;
  
  return (
    <div className="border-b pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-500">{category}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{currentStock} left</p>
          <p className="text-sm text-gray-500">Min: {minStock}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${percentage < 30 ? 'bg-red-500' : 'bg-yellow-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

// ActivityLogItem component
function ActivityLogItem({ action, user, item, timestamp }) {
  return (
    <div className="flex items-start space-x-3 mb-4 last:mb-0">
      <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
        <span>🔄</span>
      </div>
      <div className="flex-1">
        <p className="text-sm"><span className="font-medium">{user}</span> {action} <span className="font-medium">{item}</span></p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}

// Donut Chart component for café categories
function CategoryDonutChart({ data }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} items`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Line Chart component for 30-day inventory levels
function InventoryTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalItems" stroke="#8884d8" name="Total Items" />
        <Line type="monotone" dataKey="lowStock" stroke="#ffc658" name="Low Stock" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch metrics data
  const { data: metrics = { totalItems: 0, lowStockCount: 0, restockCount: 0, outOfStockCount: 0 }, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["/api/inventory/metrics"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch metrics:", res.status);
          return { totalItems: 0, lowStockCount: 0, restockCount: 0, outOfStockCount: 0 };
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching metrics:", error);
        return { totalItems: 0, lowStockCount: 0, restockCount: 0, outOfStockCount: 0 };
      }
    },
  });
  
  // Fetch low stock items
  const { data: lowStockItems = [], isLoading: isLowStockLoading } = useQuery({
    queryKey: ["/api/inventory/low-stock"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch low stock items:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching low stock items:", error);
        return [];
      }
    },
  });
  
  // Fetch recent activity logs
  const { data: activityLogs = [], isLoading: isActivityLoading } = useQuery({
    queryKey: ["/api/activity-logs"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch activity logs:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        return [];
      }
    },
  });
  
  // Fetch category data for donut chart
  const { data: categoryData = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ["/api/inventory/categories"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch category data:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching category data:", error);
        return [];
      }
    },
  });
  
  // Fetch inventory trend data for line chart
  const { data: trendData = [], isLoading: isTrendLoading } = useQuery({
    queryKey: ["/api/inventory/trend"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Failed to fetch trend data:", res.status);
          return [];
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching trend data:", error);
        return [];
      }
    },
  });

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || 'User'}. Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Inventory Items" 
          value={metrics.totalItems} 
          icon="📦" 
          color="bg-blue-100 text-blue-700" 
        />
        <MetricCard 
          title="Low Stock Items" 
          value={metrics.lowStockCount} 
          icon="⚠️" 
          color="bg-yellow-100 text-yellow-700" 
        />
        <MetricCard 
          title="Expiring Soon" 
          value={metrics.restockCount} 
          icon="⏱️" 
          color="bg-purple-100 text-purple-700" 
        />
        <MetricCard 
          title="Out of Stock" 
          value={metrics.outOfStockCount} 
          icon="❌" 
          color="bg-red-100 text-red-700" 
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category distribution chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-3">
            <h2 className="font-semibold">Café Categories</h2>
          </div>
          <div className="p-4">
            {isCategoryLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="flex justify-center items-center h-[300px] text-gray-500">
                No category data available
              </div>
            ) : (
              <CategoryDonutChart data={categoryData} />
            )}
          </div>
        </div>

        {/* Inventory trend chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-3">
            <h2 className="font-semibold">30-Day Inventory Levels</h2>
          </div>
          <div className="p-4">
            {isTrendLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
              </div>
            ) : trendData.length === 0 ? (
              <div className="flex justify-center items-center h-[300px] text-gray-500">
                No trend data available
              </div>
            ) : (
              <InventoryTrendChart data={trendData} />
            )}
          </div>
        </div>
      </div>

      {/* Two column layout for low stock and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-3">
            <h2 className="font-semibold">Low Stock Items</h2>
          </div>
          <div className="p-6">
            {isLowStockLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : lowStockItems.length === 0 ? (
              <p className="text-center text-gray-500">No low stock items</p>
            ) : (
              lowStockItems.map(item => (
                <LowStockItem 
                  key={item.id}
                  name={item.name}
                  category={item.category}
                  currentStock={item.currentStock}
                  minStock={item.minStock}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-3">
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            {isActivityLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : activityLogs.length === 0 ? (
              <p className="text-center text-gray-500">No recent activity</p>
            ) : (
              activityLogs.map(log => (
                <ActivityLogItem 
                  key={log.id}
                  action={log.action}
                  user={log.user}
                  item={log.item}
                  timestamp={log.timestamp}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}