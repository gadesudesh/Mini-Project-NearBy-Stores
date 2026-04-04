import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { RetailerSidebar } from './RetailerDashboard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMenu, FiEye, FiMousePointer, FiStar, FiShoppingBag, FiPackage, FiAlertTriangle } from 'react-icons/fi';

const RetailerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products/analytics/summary');
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const stats = [
    { label: 'Total Products', value: analytics?.totalProducts || 0, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600', bgBar: 'bg-blue-200' },
    { label: 'Total Stock', value: analytics?.totalStock || 0, icon: FiPackage, color: 'bg-indigo-50 text-indigo-600', bgBar: 'bg-indigo-200' },
    { label: 'Total Views', value: analytics?.totalViews || 0, icon: FiEye, color: 'bg-green-50 text-green-600', bgBar: 'bg-green-200' },
    { label: 'Total Clicks', value: analytics?.totalClicks || 0, icon: FiMousePointer, color: 'bg-purple-50 text-purple-600', bgBar: 'bg-purple-200' },
    { label: 'Avg Rating', value: analytics?.averageRating || '—', icon: FiStar, color: 'bg-yellow-50 text-yellow-600', bgBar: 'bg-yellow-200' },
    { label: 'Low Stock Items', value: analytics?.lowStockProducts || 0, icon: FiAlertTriangle, color: 'bg-orange-50 text-orange-600', bgBar: 'bg-orange-200' },
  ];

  const categories = analytics?.categoryBreakdown || {};
  const maxCategory = Math.max(...Object.values(categories), 1);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <RetailerSidebar active="analytics" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg">
          <FiMenu size={20} />
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Track your shop's performance</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card p-5">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Products by Category</h2>
            {Object.keys(categories).length === 0 ? (
              <p className="text-gray-400 text-sm">No data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(categories)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 capitalize">{cat.replace('_', ' ')}</span>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${(count / maxCategory) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Engagement */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Engagement Overview</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Click-through Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics?.totalViews ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${analytics?.totalViews ? Math.min((analytics.totalClicks / analytics.totalViews) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shop Views</span>
                  <span className="font-semibold">{analytics?.shopViews || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shop Clicks</span>
                  <span className="font-semibold">{analytics?.shopClicks || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold">{analytics?.reviewCount || 0}</span>
                </div>
              </div>

              {analytics?.averageRating > 0 && (
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-yellow-600 mb-1">{analytics.averageRating} ★</p>
                  <p className="text-sm text-yellow-700">Average Rating from {analytics.reviewCount} reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RetailerAnalytics;