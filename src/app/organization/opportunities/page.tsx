'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  MapPin,
  Clock,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { opportunitiesAPI, organizationsAPI, authAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  location: string;
  date_posted: string;
  deadline: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'completed' | 'draft';
  required_skills: string[];
  time_commitment: string;
  organization_id: number;
  organization?: {
    id: number;
    name: string;
  };
  applications_count?: number;
  volunteers_needed: number;
  volunteers_registered?: number;
}

interface Organization {
  id: number;
  name: string;
  contact_email?: string;
  description?: string;
  location?: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Mock data for fallback
const createMockOpportunities = (organizationId: number, organizationName: string): Opportunity[] => [
  {
    id: 1,
    title: "Community Garden Volunteer",
    description: "Help maintain our community garden by planting, weeding, and harvesting fresh produce for local food banks. Perfect for those who love working outdoors and making a direct impact on food security.",
    location: "Downtown Community Center, 123 Main St",
    date_posted: "2024-01-15T10:00:00Z",
    deadline: "2024-03-01T23:59:59Z",
    start_date: "2024-02-01T09:00:00Z",
    end_date: "2024-05-31T17:00:00Z",
    status: 'active',
    required_skills: ["Gardening", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 12,
    volunteers_needed: 8,
    volunteers_registered: 5
  },
  {
    id: 2,
    title: "Youth Mentorship Program",
    description: "Mentor high school students in career development, college preparation, and life skills. Share your professional experience and help shape the next generation of leaders.",
    location: "Lincoln High School, 456 Oak Avenue",
    date_posted: "2024-01-10T14:30:00Z",
    deadline: "2024-02-15T23:59:59Z",
    start_date: "2024-02-20T16:00:00Z",
    end_date: "2024-06-15T18:00:00Z",
    status: 'active',
    required_skills: ["Mentoring", "Communication", "Leadership", "Career Guidance"],
    time_commitment: "2 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 8,
    volunteers_needed: 15,
    volunteers_registered: 10
  },
  {
    id: 3,
    title: "Senior Technology Support",
    description: "Teach seniors how to use smartphones, tablets, and computers. Help bridge the digital divide by providing patient, one-on-one technology instruction.",
    location: "Sunset Senior Center, 789 Pine Street",
    date_posted: "2024-01-08T11:15:00Z",
    deadline: "2024-02-28T23:59:59Z",
    start_date: "2024-02-05T10:00:00Z",
    end_date: "2024-04-30T16:00:00Z",
    status: 'active',
    required_skills: ["Technology", "Teaching", "Patience", "Communication"],
    time_commitment: "3 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 6,
    volunteers_needed: 10,
    volunteers_registered: 4
  },
  {
    id: 4,
    title: "Food Bank Sorting & Distribution",
    description: "Sort donated food items, pack family boxes, and assist with food distribution to families in need. A hands-on way to fight hunger in our community.",
    location: "Central Food Bank, 321 Elm Drive",
    date_posted: "2024-01-05T09:00:00Z",
    deadline: "2024-12-31T23:59:59Z",
    start_date: "2024-01-20T08:00:00Z",
    end_date: "2024-12-20T17:00:00Z",
    status: 'active',
    required_skills: ["Organization", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per month",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 25,
    volunteers_needed: 20,
    volunteers_registered: 18
  },
  {
    id: 5,
    title: "Animal Shelter Assistant",
    description: "Care for rescued animals by feeding, cleaning, walking dogs, and socializing cats. Help animals find their forever homes through love and care.",
    location: "Happy Paws Animal Shelter, 654 Birch Lane",
    date_posted: "2024-01-03T13:45:00Z",
    deadline: "2024-03-15T23:59:59Z",
    start_date: "2024-02-01T10:00:00Z",
    end_date: "2024-07-31T16:00:00Z",
    status: 'active',
    required_skills: ["Animal Care", "Physical Fitness", "Compassion"],
    time_commitment: "6 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 15,
    volunteers_needed: 12,
    volunteers_registered: 8
  },
  {
    id: 6,
    title: "Environmental Cleanup Crew",
    description: "Join our monthly environmental cleanup efforts in local parks, beaches, and waterways. Help preserve our natural spaces for future generations.",
    location: "Various locations around the city",
    date_posted: "2023-12-20T16:20:00Z",
    deadline: "2024-06-30T23:59:59Z",
    start_date: "2024-01-15T09:00:00Z",
    end_date: "2024-06-15T15:00:00Z",
    status: 'completed',
    required_skills: ["Environmental Awareness", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per month",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 30,
    volunteers_needed: 25,
    volunteers_registered: 25
  },
  {
    id: 7,
    title: "Literacy Tutoring Program",
    description: "Help adults improve their reading and writing skills through one-on-one tutoring sessions. Make a lasting impact on someone's educational journey.",
    location: "Public Library, 987 Cedar Street",
    date_posted: "2023-12-15T12:00:00Z",
    deadline: "2024-01-31T23:59:59Z",
    start_date: "2024-02-10T14:00:00Z",
    end_date: "2024-05-10T17:00:00Z",
    status: 'inactive',
    required_skills: ["Teaching", "Literacy", "Patience", "Communication"],
    time_commitment: "2 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 4,
    volunteers_needed: 8,
    volunteers_registered: 2
  },
  {
    id: 8,
    title: "Holiday Gift Wrapping Station",
    description: "Help wrap donated gifts for families in need during the holiday season. Spread joy and ensure every child has presents to unwrap.",
    location: "Community Center Main Hall",
    date_posted: "2023-11-01T10:30:00Z",
    deadline: "2023-12-15T23:59:59Z",
    start_date: "2023-12-01T10:00:00Z",
    end_date: "2023-12-24T18:00:00Z",
    status: 'completed',
    required_skills: ["Creativity", "Attention to Detail", "Holiday Spirit"],
    time_commitment: "3 hours per session",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 20,
    volunteers_needed: 15,
    volunteers_registered: 15
  },
  {
    id: 9,
    title: "Website Development Project",
    description: "Help redesign our organization's website to better serve our community. Looking for volunteers with web development, design, or content creation skills.",
    location: "Remote/Virtual",
    date_posted: "2024-01-12T15:00:00Z",
    deadline: "2024-02-20T23:59:59Z",
    start_date: "2024-02-25T09:00:00Z",
    end_date: "2024-04-25T17:00:00Z",
    status: 'draft',
    required_skills: ["Web Development", "Graphic Design", "Content Writing", "UX/UI"],
    time_commitment: "5 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 0,
    volunteers_needed: 5,
    volunteers_registered: 0
  },
  {
    id: 10,
    title: "Community Health Fair Coordinator",
    description: "Organize and coordinate our annual community health fair. Help connect residents with healthcare resources, screenings, and wellness information.",
    location: "City Park Pavilion, 159 Maple Avenue",
    date_posted: "2024-01-18T08:45:00Z",
    deadline: "2024-03-10T23:59:59Z",
    start_date: "2024-03-15T07:00:00Z",
    end_date: "2024-04-15T19:00:00Z",
    status: 'active',
    required_skills: ["Event Planning", "Healthcare Knowledge", "Organization", "Communication"],
    time_commitment: "8 hours per week",
    organization_id: organizationId,
    organization: {
      id: organizationId,
      name: organizationName
    },
    applications_count: 7,
    volunteers_needed: 6,
    volunteers_registered: 3
  }
];

const createMockOrganization = (): Organization => ({
  id: 1,
  name: "Community Impact Alliance",
  contact_email: "info@communityimpact.org",
  description: "A nonprofit organization dedicated to improving lives through community service, education, and environmental stewardship.",
  location: "Downtown Community Hub, 123 Main Street"
});

export default function OrganizationOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [orgCreationData, setOrgCreationData] = useState({
    name: '',
    description: '',
    contact_email: '',
    location: ''
  });
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usingMockData, setUsingMockData] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      // Always refresh user data first to get latest organization info
      await refreshUser?.();
      
      await Promise.all([
        fetchOpportunities(),
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
      const mockOpps = createMockOpportunities(mockOrg.id, mockOrg.name);
      
      setOrganization(mockOrg);
      setOpportunities(mockOpps);
      setUsingMockData(true);
      setError(null);
      
      console.log('Mock data loaded successfully');
    } catch (mockError) {
      console.error('Failed to load mock data:', mockError);
      setError('Failed to load both real and mock data');
    }
  };

  const fetchOpportunities = async () => {
    try {
      console.log('Fetching opportunities...');
      
      // Get current user data
      const currentUserResponse = await authAPI.getCurrentUser();
      const userData = currentUserResponse.data;
      
      console.log('Current user data:', userData);
      setDebugInfo(userData);
      
      // Extract organization ID with improved logic
      const organizationId = extractOrganizationId(userData);
      console.log('Extracted organization ID:', organizationId);
      
      if (!organizationId) {
        await handleMissingOrganization(userData);
        return;
      }

      await fetchOpportunitiesForOrganization(organizationId);
      
    } catch (error: any) {
      console.error('Error in fetchOpportunities:', error);
      throw error; // Re-throw to trigger mock data fallback
    }
  };
  const handleMissingOrganization = async (userData: any) => {
    if (userData.role !== 'organization') {
      throw new Error('This page is only accessible to organization accounts.');
    }

    console.log('No organization ID found, attempting to find or create organization');
    
    try {
      // Try to get organization via the me endpoint
      const orgResponse = await organizationsAPI.getCurrentUserOrganization();
      if (orgResponse.data?.id) {
        console.log('Found organization via getCurrentUserOrganization:', orgResponse.data);
        setOrganization(orgResponse.data);
        await fetchOpportunitiesForOrganization(orgResponse.data.id);
        return;
      }
    } catch (orgError) {
      console.log('getCurrentUserOrganization failed:', orgError);
    }
    
    try {
      // Try to find organization by email
      const allOrgsResponse = await organizationsAPI.getAll({ 
        limit: 100 // Get more results to search through
      });
      
      const allOrgs = Array.isArray(allOrgsResponse.data) 
        ? allOrgsResponse.data 
        : allOrgsResponse.data?.items || [];
      
      const userOrg = allOrgs.find((org: Organization) => 
        org.contact_email === userData.email
      );
      
      if (userOrg) {
        console.log('Found matching organization by email:', userOrg);
        setOrganization(userOrg);
        
        // Update user's organization_id on the backend
        try {
          await authAPI.updateProfile({ organization_id: userOrg.id });
          console.log('Updated user organization_id');
        } catch (updateError) {
          console.log('Failed to update user organization_id:', updateError);
        }
        
        await fetchOpportunitiesForOrganization(userOrg.id);
        return;
      }
    } catch (searchError) {
      console.log('Failed to search organizations:', searchError);
    }
    
    // If we get here, no organization was found
    throw new Error(
      'No organization profile found for your account. Please create an organization profile to manage opportunities.'
    );
  };

  const fetchOpportunitiesForOrganization = async (orgId: number) => {
    let opportunitiesData: Opportunity[] = [];

    try {
      console.log('Fetching opportunities for organization:', orgId);
      
      // Try multiple methods to get opportunities
      const methods = [
        // Method 1: Direct organization opportunities endpoint
        async () => {
          const response = await organizationsAPI.getOpportunities(orgId);
          return Array.isArray(response.data) ? response.data : response.data?.items || [];
        },
        
        // Method 2: Get all opportunities and filter by organization_id
        async () => {
          const response = await opportunitiesAPI.getAll();
          const allOpps = Array.isArray(response.data) ? response.data : response.data?.items || [];
          return allOpps.filter((opp: Opportunity) => opp.organization_id === orgId);
        },
        
        // Method 3: Get opportunities with organization_id parameter
        async () => {
          const response = await opportunitiesAPI.getAll({ organization_id: orgId });
          return Array.isArray(response.data) ? response.data : response.data?.items || [];
        }
      ];

      for (const [index, method] of methods.entries()) {
        try {
          console.log(`Trying method ${index + 1}...`);
          opportunitiesData = await method();
          console.log(`Method ${index + 1} succeeded:`, opportunitiesData);
          break;
        } catch (methodError) {
          console.log(`Method ${index + 1} failed:`, methodError);
          if (index === methods.length - 1) {
            throw methodError;
          }
        }
      }

    } catch (error) {
      console.error('All methods failed:', error);
      throw new Error('Unable to fetch opportunities. Please check your connection and try again.');
    }
    
    console.log('Final opportunities data:', opportunitiesData);
    setOpportunities(opportunitiesData);
  };

  const fetchOrganizationInfo = async () => {
    try {
      const currentUserResponse = await authAPI.getCurrentUser();
      const userData = currentUserResponse.data;
      
      const organizationId = extractOrganizationId(userData);
      
      if (!organizationId) {
        console.log('No organization ID found for user');
        return;
      }
      
      try {
        const response = await organizationsAPI.getById(organizationId);
        console.log('Organization details:', response.data);
        setOrganization(response.data);
      } catch (error) {
        console.log('Could not fetch organization details:', error);
        
        // Fallback to basic organization info
        const orgName = userData.organization?.name || 
                       userData.organization_name || 
                       'Unknown Organization';
        
        setOrganization({
          id: organizationId,
          name: orgName
        });
      }
    } catch (error: any) {
      console.error('Error fetching organization info:', error);
      throw error; // Re-throw to trigger mock data fallback
    }
  };

  const extractOrganizationId = (userData: any): number | null => {
    // Comprehensive list of possible fields where organization ID might be stored
    const possibleFields = [
      'organization_id',
      'org_id',
      'organization.id',
      'organizationId',
      'organization_profile_id',
      'profile_id',
      'company_id',
      'orgId'
    ];
    
    for (const field of possibleFields) {
      const value = getNestedValue(userData, field);
      if (value && (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value))))) {
        return Number(value);
      }
    }
    
    return null;
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  const getErrorMessage = (error: ApiError): string => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred while fetching opportunities';
  };

  const handleCreateOrganization = async () => {
    try {
      if (!orgCreationData.name || !orgCreationData.contact_email) {
        alert('Please fill in required fields (Name and Contact Email)');
        return;
      }

      const response = await organizationsAPI.create({
        ...orgCreationData,
        contact_email: orgCreationData.contact_email || user?.email || ''
      });

      console.log('Created organization:', response.data);
      setOrganization(response.data);
      setShowCreateOrgModal(false);
      
      // Update user's organization_id
      try {
        await authAPI.updateProfile({ organization_id: response.data.id });
        console.log('Updated user organization_id');
        await refreshUser?.(); // Refresh user context
      } catch (updateError) {
        console.log('Failed to update user organization_id:', updateError);
      }
      
      // Fetch opportunities for the new organization
      await fetchOpportunitiesForOrganization(response.data.id);
      
      alert('Organization created successfully!');
    } catch (error: any) {
      console.error('Error creating organization:', error);
      alert(getErrorMessage(error));
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!selectedOpportunity) return;

    try {
      if (usingMockData) {
        // Handle mock data deletion
        setOpportunities(prev => prev.filter(opp => opp.id !== selectedOpportunity.id));
        setShowDeleteModal(false);
        setSelectedOpportunity(null);
        alert('Opportunity deleted successfully (mock data)');
        return;
      }

      await opportunitiesAPI.delete(selectedOpportunity.id);
      setOpportunities(prev => prev.filter(opp => opp.id !== selectedOpportunity.id));
      setShowDeleteModal(false);
      setSelectedOpportunity(null);
      alert('Opportunity deleted successfully');
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      alert(getErrorMessage(error));
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

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = 
      opportunity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || opportunity.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading opportunities...</span>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">Error Loading Opportunities</h3>
              <p className="text-red-700 mb-4">{error}</p>
              
              {/* Debug Information */}
              {debugInfo && process.env.NODE_ENV === 'development' && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                    Show Debug Information (Development Only)
                  </summary>
                  <div className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                </details>
              )}
              
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
                
                {user?.role === 'organization' && error.includes('organization profile') && (
                  <button 
                    onClick={() => {
                      setShowCreateOrgModal(true);
                      setOrgCreationData({
                        name: '',
                        description: '',
                        contact_email: user?.email || '',
                        location: ''
                      });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create Organization Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  You're viewing sample data. Real data will be loaded when the API is available.
                </p>
              </div>
            </div>
            <button 
              onClick={handleRetry}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Try Real Data
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Opportunities</h1>
          <p className="text-gray-500">
            Manage opportunities for {organization?.name || 'your organization'}
            {usingMockData && ' (Demo)'}
          </p>
          {debugInfo && process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-400 mt-1">
              User ID: {debugInfo.id} | Org ID: {extractOrganizationId(debugInfo)} | Role: {debugInfo.role}
            </p>
          )}
        </div>
        <Link
          href="/organization/opportunities/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Opportunity
        </Link>
      </div>

      {/* Summary Stats */}
      {opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {opportunities.filter(opp => opp.status === 'active').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-purple-600">
                  {opportunities.reduce((sum, opp) => sum + (opp.applications_count || 0), 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volunteers Needed</p>
                <p className="text-2xl font-bold text-orange-600">
                  {opportunities.reduce((sum, opp) => sum + (opp.volunteers_needed || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search opportunities..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button 
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter className="h-4 w-4" />
            <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                {['all', 'active', 'inactive', 'completed', 'draft'].map((status) => (
                  <button 
                    key={status}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Opportunities ({filteredOpportunities.length})
          </h2>
        </div>
        <div>
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first volunteer opportunity'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  href="/organization/opportunities/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Opportunity
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{opportunity.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                            {opportunity.description}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {opportunity.location || 'Location not specified'}
                          </div>
                          {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opportunity.required_skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {skill}
                                </span>
                              ))}
                              {opportunity.required_skills.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{opportunity.required_skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(opportunity.status)}`}
                        >
                          {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                        </span>
                        {opportunity.time_commitment && (
                          <div className="text-xs text-gray-500 mt-1">
                            {opportunity.time_commitment}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {opportunity.volunteers_registered || 0}/{opportunity.volunteers_needed || 0}
                          </span>
                        </div>
                        {opportunity.applications_count !== undefined && (
                          <div className="text-xs text-gray-500">
                            {opportunity.applications_count} applications
                          </div>
                        )}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((opportunity.volunteers_registered || 0) / (opportunity.volunteers_needed || 1)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Start: {formatDate(opportunity.start_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>End: {formatDate(opportunity.end_date)}</span>
                        </div>
                        {opportunity.deadline && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Deadline: {formatDate(opportunity.deadline)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/opportunities/${opportunity.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={usingMockData ? '#' : `/organization/opportunities/${opportunity.id}/edit`}
                            className={`p-1 rounded transition-colors ${
                              usingMockData 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title={usingMockData ? 'Edit not available in demo mode' : 'Edit'}
                            onClick={usingMockData ? (e) => e.preventDefault() : undefined}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedOpportunity(opportunity);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Opportunity
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{selectedOpportunity.title}"? 
                {usingMockData ? ' This will only remove it from the demo data.' : ' This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedOpportunity(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOpportunity}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create Organization Profile
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                It looks like your account isn't linked to an organization yet. Create your organization profile to get started.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={orgCreationData.name}
                    onChange={(e) => setOrgCreationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={orgCreationData.contact_email}
                    onChange={(e) => setOrgCreationData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={orgCreationData.location}
                    onChange={(e) => setOrgCreationData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={orgCreationData.description}
                    onChange={(e) => setOrgCreationData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your organization (optional)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateOrgModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrganization}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
