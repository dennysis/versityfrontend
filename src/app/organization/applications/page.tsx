'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, User, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { matchesAPI, organizationsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  createMockApplications, 
  createMockOrganization, 
  MockApplication 
} from '@/lib/mockData';

interface Application {
  id: number;
  volunteer_name: string;
  volunteer_id: number;
  volunteer_email: string;
  opportunity_title: string;
  opportunity_id: number;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
  applied_at?: string;
  skills?: string;
  message: string;
}

interface Organization {
  id: number;
  name: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      await Promise.all([
        fetchApplications(),
        fetchOrganizationInfo()
      ]);
    } catch (error) {
      console.error('Error in fetchData:', error);
      console.log('Falling back to mock data...');
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    try {
      const mockOrg = createMockOrganization();
      const mockApplications = createMockApplications();
      
      // Transform mock applications to match the expected interface
      const transformedApplications: Application[] = mockApplications.map(app => ({
        id: app.id,
        volunteer_name: app.volunteer_name,
        volunteer_id: app.volunteer_id,
        volunteer_email: app.volunteer_email,
        opportunity_title: app.opportunity_title,
        opportunity_id: app.opportunity_id,
        status: app.status === 'approved' ? 'approved' : 
                app.status === 'rejected' ? 'rejected' : 'pending',
        applied_date: app.applied_at,
        applied_at: app.applied_at,
        skills: generateMockSkills(),
        message: app.message || ''
      }));
      
      setOrganization(mockOrg);
      setApplications(transformedApplications);
      setUsingMockData(true);
      setError(null);
      
      console.log('Mock application data loaded successfully');
    } catch (mockError) {
      console.error('Failed to load mock data:', mockError);
      setError('Failed to load both real and mock data');
    }
  };

  const generateMockSkills = (): string => {
    const skillSets = [
      'Teaching, Communication, Leadership',
      'Gardening, Physical Labor, Teamwork',
      'Technology, Patience, Problem Solving',
      'Organization, Event Planning, Public Speaking',
      'Animal Care, Compassion, Physical Fitness',
      'Environmental Awareness, Research, Data Analysis',
      'Web Development, Graphic Design, UX/UI',
      'Healthcare Knowledge, First Aid, Empathy',
      'Translation, Administrative Support, Customer Service',
      'Mentoring, Career Guidance, Networking'
    ];
    return skillSets[Math.floor(Math.random() * skillSets.length)];
  };

  const fetchApplications = async () => {
    try {
      if (!user?.organization_id) {
        throw new Error('Organization not found');
      }

      const response = await matchesAPI.getAll();
      const allApplications = response.data?.items || response.data || [];
      
      // Filter applications for this organization's opportunities
      const orgOpportunitiesResponse = await organizationsAPI.getOpportunities(user.organization_id);
      const orgOpportunities = orgOpportunitiesResponse.data?.items || orgOpportunitiesResponse.data || [];
      const orgOpportunityIds = orgOpportunities.map((opp: any) => opp.id);
      
      const orgApplications = allApplications.filter((app: any) => 
        orgOpportunityIds.includes(app.opportunity_id)
      );
      
      // Transform to match expected interface
      const transformedApplications: Application[] = orgApplications.map((app: any) => {
        const opportunity = orgOpportunities.find((opp: any) => opp.id === app.opportunity_id);
        return {
          id: app.id,
          volunteer_name: app.volunteer_name || `Volunteer ${app.volunteer_id}`,
          volunteer_id: app.volunteer_id,
          volunteer_email: app.volunteer_email || '',
          opportunity_title: opportunity?.title || 'Unknown Opportunity',
          opportunity_id: app.opportunity_id,
          status: app.status === 'approved' ? 'approved' : 
                  app.status === 'rejected' ? 'rejected' : 'pending',
          applied_date: app.applied_at || app.created_at || new Date().toISOString(),
          applied_at: app.applied_at || app.created_at,
          skills: app.skills || generateMockSkills(),
          message: app.message || app.cover_letter || ''
        };
      });
      
      setApplications(transformedApplications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      throw new Error(error.response?.data?.message || 'Failed to load applications');
    }
  };

  const fetchOrganizationInfo = async () => {
    try {
      if (!user?.organization_id) return;
      
      const response = await organizationsAPI.getById(user.organization_id);
      setOrganization(response.data);
    } catch (error: any) {
      console.error('Error fetching organization info:', error);
      // Don't throw here, just log the error
    }
  };

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    setUsingMockData(false);
    await fetchData();
  };

  const handleUseMockData = () => {
    loadMockData();
  };

  const filteredApplications = applications.filter(app => {
    // Skip invalid applications
    if (!app || typeof app !== 'object') return false;
    
    // Safely handle potentially undefined/null values
    const volunteerName = app.volunteer_name || '';
    const opportunityTitle = app.opportunity_title || '';
    const status = app.status || '';
    const searchLower = (searchQuery || '').toLowerCase();
    
    // Handle search matching
    const matchesSearch = !searchQuery || 
      volunteerName.toLowerCase().includes(searchLower) ||
      opportunityTitle.toLowerCase().includes(searchLower);
      
    // Handle status filtering
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      setUpdating(id);
      
      if (!usingMockData) {
        await matchesAPI.updateStatus(id, newStatus);
      } else {
        // Simulate API delay for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update local state
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
      
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
      
      setDialogOpen(false);
      
      // Show success message
      if (usingMockData) {
        alert(`Application ${newStatus} successfully (Demo Mode)`);
      }
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusStyle = (status: string) => {
    if (!status) return 'text-gray-700 bg-gray-100';
    
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="space-y-6 p-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="max-w-2xl mx-auto mt-10 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-medium mb-2">Error Loading Applications</h3>
                <p className="text-red-700 mb-4">{error}</p>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry {retryCount > 0 && `(${retryCount})`}
                  </button>
                  
                  <button 
                    onClick={handleUseMockData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Use Demo Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 p-4">
      {/* Mock Data Banner */}
      {usingMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <h4 className="text-blue-800 font-medium">Demo Mode</h4>
                <p className="text-blue-700 text-sm">
                  You're viewing sample application data. Real data will be loaded when the API is available.
                </p>
              </div>
            </div>
            <button 
              onClick={handleRetry}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Try Real Data
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-500">
            Manage volunteer applications for {organization?.name || 'your organization'}
            {usingMockData && ' (Demo)'}
          </p>
        </div>
        
        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-3 text-center">
            <div className="text-lg font-bold text-gray-700">{statusCounts.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-lg border p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg border p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statusCounts.approved}</div>
            <div className="text-xs text-gray-500">Approved</div>
          </div>
          <div className="bg-white rounded-lg border p-3 text-center">
            <div className="text-lg font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-xs text-gray-500">Rejected</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
               <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Applications ({filteredApplications.length})
          </h2>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : usingMockData 
                  ? 'This is demo data - real applications will appear when volunteers apply to your opportunities'
                  : 'Applications will appear here when volunteers apply to your opportunities'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {application.volunteer_name || 'Unknown Volunteer'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.volunteer_email || 'No email provided'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {application.opportunity_title || 'Unknown Opportunity'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(application.applied_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(application.status)}`}>
                        {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {application.skills || 'No skills listed'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {dialogOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Application Details</h2>
                  <p className="text-gray-500">
                    Review and manage this volunteer application
                    {usingMockData && ' (Demo Data)'}
                  </p>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setDialogOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Volunteer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Volunteer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.volunteer_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.volunteer_email || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Skills</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedApplication.skills || 'No skills listed'}</p>
                    </div>
                  </div>
                </div>

                {/* Opportunity Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Opportunity</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedApplication.opportunity_title || 'Unknown Opportunity'}</p>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.applied_date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Status</label>
                      <span className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${getStatusStyle(selectedApplication.status)}`}>
                        {selectedApplication.status ? selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    {selectedApplication.message && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message from Volunteer</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApplication.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-800">Review Application</h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      This application is pending your review. You can approve or reject it below.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                        disabled={updating === selectedApplication.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {updating === selectedApplication.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                        disabled={updating === selectedApplication.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        {updating === selectedApplication.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedApplication.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Application Approved</h3>
                        <p className="text-sm text-green-700">
                          This volunteer has been approved for the opportunity. You can contact them directly to coordinate next steps.
                        </p>
                      </div>
                    </div>
                    {selectedApplication.volunteer_email && (
                      <div className="mt-3">
                        <a
                          href={`mailto:${selectedApplication.volunteer_email}`}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Send Email
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {selectedApplication.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">Application Rejected</h3>
                        <p className="text-sm text-red-700">
                          This application has been rejected. The volunteer has been notified of the decision.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

