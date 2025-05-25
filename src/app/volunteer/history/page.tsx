'use client';

import { useState, useEffect } from 'react';
import { matchesAPI, hoursAPI, authAPI } from '@/lib/api';
import { Calendar, Clock, Award, MapPin, Building } from 'lucide-react';

export default function VolunteerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalHours: 0,
    verifiedHours: 0,
    organizationsHelped: 0
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const userResponse = await authAPI.getCurrentUser();
        const userId = userResponse.data.id;

        // Fetch matches and hours in parallel
        const [matchesResponse, hoursResponse] = await Promise.allSettled([
          matchesAPI.getByVolunteer(userId),
          hoursAPI.getByVolunteer(userId)
        ]);

        let matches = [];
        let hours = [];

        if (matchesResponse.status === 'fulfilled') {
          matches = matchesResponse.value.data || [];
        }

        if (hoursResponse.status === 'fulfilled') {
          hours = hoursResponse.value.data || [];
        }

        // Combine and sort by date
        const combinedHistory = [
          ...matches.map(match => ({
            ...match,
            type: 'application',
            date: match.created_at || match.updated_at,
            title: match.opportunity?.title || 'Unknown Opportunity',
            organization: match.opportunity?.organization?.name || 'Unknown Organization'
          })),
          ...hours.map(hour => ({
            ...hour,
            type: 'hours',
            title: hour.opportunity?.title || 'General Volunteer Work',
            organization: hour.opportunity?.organization?.name || 'Independent'
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setHistory(combinedHistory);

        // Calculate stats
        const uniqueOrgs = new Set(matches.map(m => m.opportunity?.organization?.id).filter(Boolean));
        const totalHours = hours.reduce((sum, h) => sum + (h.hours || 0), 0);
        const verifiedHours = hours.filter(h => h.status === 'verified').reduce((sum, h) => sum + (h.hours || 0), 0);

        setStats({
          totalOpportunities: matches.length,
          totalHours,
          verifiedHours,
          organizationsHelped: uniqueOrgs.size
        });

      } catch (error) {
        console.error('History fetch error:', error);
        setError('Failed to load volunteer history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'applications') return item.type === 'application';
    if (activeTab === 'hours') return item.type === 'hours';
    return true;
  });

  const getStatusColor = (status, type) => {
    if (type === 'application') {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'verified': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemIcon = (type, status) => {
    if (type === 'application') {
      return <Building className="h-5 w-5" />;
    } else {
      return <Clock className="h-5 w-5" />;
    }
  };

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
        <h1 className="text-3xl font-bold">Volunteer History</h1>
        <p className="text-gray-600">Your complete volunteer journey and impact</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Opportunities</p>
              <p className="text-2xl font-bold">{stats.totalOpportunities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold">{stats.totalHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Hours</p>
              <p className="text-2xl font-bold">{stats.verifiedHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Organizations</p>
              <p className="text-2xl font-bold">{stats.organizationsHelped}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Activity Timeline</h2>
            <div className="flex border rounded-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'applications' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  activeTab === 'hours' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hours
              </button>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-500 mb-4">
              Start volunteering to build your impact history.
            </p>
            <a 
              href="/volunteer/opportunities"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Find Opportunities
            </a>
          </div>
        ) : (
          <div className="divide-y">
            {filteredHistory.map((item, index) => (
              <div key={`${item.type}-${item.id}-${index}`} className="p-6 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'application' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {getItemIcon(item.type, item.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600">{item.organization}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(item.status, item.type)}`}>
                          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>

                    {item.type === 'hours' && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.hours} {item.hours === 1 ? 'hour' : 'hours'}
                        </span>
                      </div>
                    )}

                    {item.description && (
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {item.type === 'application' && item.status === 'accepted' && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        ✅ Application accepted - You can now log volunteer hours for this opportunity
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
