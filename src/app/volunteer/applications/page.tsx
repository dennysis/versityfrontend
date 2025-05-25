'use client';

import { useState, useEffect } from 'react';
import { matchesAPI, authAPI } from '@/lib/api';
import { Calendar, MapPin, Building } from 'lucide-react';

export default function VolunteerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawing, setWithdrawing] = useState(new Set());

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user first
        const userResponse = await authAPI.getCurrentUser();
        const userId = userResponse.data.id;

        // Fetch applications using the correct API
        const response = await matchesAPI.getByVolunteer(userId);
        setApplications(response.data || []);

      } catch (error) {
        console.error('Applications fetch error:', error);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleWithdrawApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      setWithdrawing(prev => new Set(prev).add(applicationId));
      
      await matchesAPI.delete(applicationId);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setWithdrawing(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-gray-600">Track your volunteer opportunity applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Building className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-4">You haven't applied to any volunteer opportunities yet.</p>
          <a 
            href="/volunteer/opportunities" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Opportunities
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {application.opportunity?.title || 'Opportunity Title'}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <Building className="h-4 w-4" />
                        <span>{application.opportunity?.organization?.name || 'Organization'}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(application.status)}`}>
                      {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {application.opportunity?.description || 'No description available'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied: {formatDate(application.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {application.opportunity?.location || 'Location TBD'}
                    </span>
                  </div>

                  {application.status === 'accepted' && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        🎉 Congratulations! Your application has been accepted.
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        The organization will contact you with next steps.
                      </p>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm font-medium">
                        Application not selected this time.
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        Don't give up! There are many other opportunities available.
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  {application.status === 'pending' && (
                    <button 
                      onClick={() => handleWithdrawApplication(application.id)}
                      disabled={withdrawing.has(application.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {withdrawing.has(application.id) ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                  
                  <a 
                    href={`/opportunities/${application.opportunity?.id}`}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 text-sm text-center"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {applications.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {applications.length}
              </div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-500">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
