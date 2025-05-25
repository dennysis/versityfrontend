'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { 
  Users, 
  Building, 
  Calendar, 
  Clock, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  total_users: number;
  total_volunteers: number;
  total_organizations: number;
  total_opportunities: number;
  total_matches: number;
  total_hours: number;
  pending_applications: number;
  recent_activity: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🎯 IMPLEMENTATION: adminAPI.getDashboard() & adminAPI.getDashboardStats()
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        dashboardResponse,
        statsResponse,
        analyticsResponse
      ] = await Promise.allSettled([
        adminAPI.getDashboard(),        // 🎯 NEW API
        adminAPI.getDashboardStats(),   // 🎯 NEW API  
        adminAPI.getAnalytics()         // ✅ Already implemented
      ]);

      // Combine data from multiple sources
      let combinedStats: DashboardStats = {
        total_users: 0,
        total_volunteers: 0,
        total_organizations: 0,
        total_opportunities: 0,
        total_matches: 0,
        total_hours: 0,
        pending_applications: 0,
        recent_activity: []
      };

      // Handle dashboard data
      if (dashboardResponse.status === 'fulfilled') {
        const dashboardData = dashboardResponse.value.data;
        combinedStats = { ...combinedStats, ...dashboardData };
      }

      // Handle stats data
      if (statsResponse.status === 'fulfilled') {
        const statsData = statsResponse.value.data;
        combinedStats = { ...combinedStats, ...statsData };
      }

      // Handle analytics data (fallback)
      if (analyticsResponse.status === 'fulfilled') {
        const analyticsData = analyticsResponse.value.data;
        combinedStats = { ...combinedStats, ...analyticsData };
      }

      setStats(combinedStats);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_organizations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_opportunities || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_hours || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_matches || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_volunteers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pending_applications || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">{activity.description || 'Recent activity'}</span>
                  <span className="text-xs text-gray-500">{activity.timestamp || 'Just now'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
