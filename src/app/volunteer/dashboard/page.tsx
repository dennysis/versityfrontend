'use client';

import { useState, useEffect } from 'react';
import { volunteersAPI, authAPI, opportunitiesAPI, matchesAPI } from '@/lib/api';
import { Clock, Award, Target, TrendingUp } from 'lucide-react';

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({
    totalHours: 0,
    verifiedHours: 0,
    activeOpportunities: 0,
    completedOpportunities: 0
  });
  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user first
        const userResponse = await authAPI.getCurrentUser();
        const user = userResponse.data;
        
        // Fetch all data in parallel with proper error handling
        const [statsResponse, hoursResponse, matchesResponse, opportunitiesResponse] = await Promise.allSettled([
          volunteersAPI.getStats(user.id).catch(() => ({ data: { total_hours: 0, verified_hours: 0 } })),
          volunteersAPI.getHours(user.id).catch(() => ({ data: [] })),
          volunteersAPI.getMatches(user.id).catch(() => ({ data: [] })),
          opportunitiesAPI.getAll({ limit: 5 }).catch(() => ({ data: [] }))
        ]);

        // Process stats
        if (statsResponse.status === 'fulfilled') {
          const statsData = statsResponse.value.data;
          setStats(prev => ({
            ...prev,
            totalHours: statsData.total_hours || 0,
            verifiedHours: statsData.verified_hours || 0
          }));
        }

        // Process matches
        if (matchesResponse.status === 'fulfilled') {
          const matches = matchesResponse.value.data;
          setStats(prev => ({
            ...prev,
            activeOpportunities: matches.filter(m => m.status === 'accepted').length,
            completedOpportunities: matches.filter(m => m.status === 'completed').length
          }));
        }

        // Process opportunities
        if (opportunitiesResponse.status === 'fulfilled') {
          setRecentOpportunities(opportunitiesResponse.value.data?.items || opportunitiesResponse.value.data || []);
        }

      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your volunteer summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Clock className="h-6 w-6" />}
          title="Total Hours"
          value={stats.totalHours}
          color="blue"
        />
        <StatCard 
          icon={<Award className="h-6 w-6" />}
          title="Verified Hours"
          value={stats.verifiedHours}
          color="green"
        />
        <StatCard 
          icon={<Target className="h-6 w-6" />}
          title="Active Projects"
          value={stats.activeOpportunities}
          color="purple"
        />
        <StatCard 
          icon={<TrendingUp className="h-6 w-6" />}
          title="Completed"
          value={stats.completedOpportunities}
          color="orange"
        />
      </div>

      {/* Recent Opportunities */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Available Opportunities</h3>
        <div className="space-y-3">
          {recentOpportunities.slice(0, 3).map((opportunity) => (
            <div key={opportunity.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{opportunity.title}</h4>
                <p className="text-sm text-gray-600">{opportunity.organization?.name}</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
