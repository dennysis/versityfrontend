'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Mail, 
  Clock, 
  User, 
  Calendar, 
  Filter,
  ChevronDown,
  Users,
  Award,
  MapPin,
  Phone,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { organizationsAPI, authAPI, matchesAPI, volunteersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  createMockVolunteers, 
  createMockOrganization, 
  MockVolunteer, 
  MockOrganization 
} from '@/lib/mockData';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string;
  location?: string;
  joined_date: string;
  total_hours: number;
  verified_hours: number;
  skills: string[];
  status: 'active' | 'inactive';
  user_id?: number;
  opportunities: {
    id: number;
    title: string;
    status: 'ongoing' | 'completed' | 'upcoming';
  }[];
}

interface Organization {
  id: number;
  name: string;
}

export default function OrganizationVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showVolunteerDetails, setShowVolunteerDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
        fetchVolunteers(),
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
      const mockVolunteers = createMockVolunteers(mockOrg.id);
      
      setOrganization(mockOrg);
      setVolunteers(mockVolunteers);
      setUsingMockData(true);
      setError(null);
      
      console.log('Mock volunteer data loaded successfully');
    } catch (mockError) {
      console.error('Failed to load mock data:', mockError);
      setError('Failed to load both real and mock data');
    }
  };

  const fetchVolunteers = async () => {
    try {
      if (!user?.organization_id) {
        throw new Error('Organization not found');
      }

      // Get volunteers who have applied to this organization's opportunities
      const matchesResponse = await matchesAPI.getAll();
      const allMatches = matchesResponse.data?.items || matchesResponse.data || [];
      
      // Get organization's opportunities to filter matches
      const opportunitiesResponse = await organizationsAPI.getOpportunities(user.organization_id);
            const orgOpportunities = opportunitiesResponse.data?.items || opportunitiesResponse.data || [];
      const orgOpportunityIds = orgOpportunities.map((opp: any) => opp.id);
      
      // Filter matches for this organization's opportunities
      const orgMatches = allMatches.filter((match: any) => 
        orgOpportunityIds.includes(match.opportunity_id)
      );
      
      // Get unique volunteer IDs
      const volunteerIds = [...new Set(orgMatches.map((match: any) => match.volunteer_id))];
      
      // Fetch volunteer details
      const volunteersData: Volunteer[] = [];
      
      for (const volunteerId of volunteerIds) {
        try {
          // Try to get volunteer profile
          let volunteerData;
          try {
            const volunteerResponse = await volunteersAPI.getProfile(volunteerId);
            volunteerData = volunteerResponse.data;
          } catch (error) {
            // If volunteer API fails, skip this volunteer
            console.warn(`Could not fetch volunteer ${volunteerId}:`, error);
            continue;
          }
          
          // Get volunteer's matches for this organization
          const volunteerMatches = orgMatches.filter((match: any) => match.volunteer_id === volunteerId);
          
          // Get volunteer's opportunities
          const volunteerOpportunities = volunteerMatches.map((match: any) => {
            const opportunity = orgOpportunities.find((opp: any) => opp.id === match.opportunity_id);
            return {
              id: opportunity?.id || match.opportunity_id,
              title: opportunity?.title || 'Unknown Opportunity',
              status: match.status === 'approved' ? 'ongoing' : 
                      match.status === 'completed' ? 'completed' : 'upcoming'
            };
          });
          
          // Calculate hours (mock data for now)
          const totalHours = Math.floor(Math.random() * 50) + 10;
          const verifiedHours = Math.floor(totalHours * 0.8);
          
          const volunteer: Volunteer = {
            id: volunteerData.id || volunteerId,
            name: volunteerData.name || volunteerData.full_name || 'Unknown Volunteer',
            email: volunteerData.email || '',
            avatar: volunteerData.avatar || null,
            phone: volunteerData.phone || '',
            location: volunteerData.location || '',
            joined_date: volunteerData.created_at || new Date().toISOString(),
            total_hours: totalHours,
            verified_hours: verifiedHours,
            skills: volunteerData.skills || [],
            status: volunteerMatches.some((match: any) => match.status === 'approved') ? 'active' : 'inactive',
            user_id: volunteerData.user_id || volunteerId,
            opportunities: volunteerOpportunities
          };
          
          volunteersData.push(volunteer);
        } catch (error) {
          console.error(`Error processing volunteer ${volunteerId}:`, error);
        }
      }
      
      setVolunteers(volunteersData);
    } catch (error: any) {
      console.error('Error fetching volunteers:', error);
      throw new Error(error.response?.data?.message || 'Failed to load volunteers');
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

  const filteredVolunteers = volunteers.filter(volunteer => {
    // Apply search filter
    const matchesSearch = 
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = 
      filterStatus === 'all' || volunteer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewVolunteer = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowVolunteerDetails(true);
  };

  const handleSendMessage = (email: string) => {
    // In a real implementation, this would open a messaging interface
    window.location.href = `mailto:${email}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getOpportunityStatusColor = (status: 'ongoing' | 'completed' | 'upcoming') => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading volunteers...</span>
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
              <h3 className="text-red-800 font-medium mb-2">Error Loading Volunteers</h3>
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
                  You're viewing sample volunteer data. Real data will be loaded when the API is available.
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
          <h1 className="text-3xl font-bold">Volunteers</h1>
          <p className="text-gray-500">
            Manage volunteers working with {organization?.name || 'your organization'}
            {usingMockData && ' (Demo)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{volunteers.length}</div>
                <div className="text-sm text-gray-500">Total Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {volunteers.filter(v => v.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {volunteers.reduce((sum, v) => sum + v.verified_hours, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search volunteers..."
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
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">Filter by Status</div>
                <hr />
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setFilterStatus('all');
                    setShowFilterDropdown(false);
                  }}
                >
                  All Volunteers
                </button>
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setFilterStatus('active');
                    setShowFilterDropdown(false);
                  }}
                >
                  Active Volunteers
                </button>
                <button 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setFilterStatus('inactive');
                    setShowFilterDropdown(false);
                  }}
                >
                  Inactive Volunteers
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Volunteer Roster ({filteredVolunteers.length})</h2>
        </div>
        <div>
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : usingMockData 
                    ? 'This is demo data - real volunteers will appear when they apply to your opportunities'
                    : 'Volunteers will appear here when they apply to your opportunities'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                            {volunteer.avatar ? (
                              <Image 
                                src={volunteer.avatar} 
                                alt={volunteer.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              volunteer.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{volunteer.name}</div>
                            <div className="text-sm text-gray-500">{volunteer.email}</div>
                            {volunteer.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <MapPin className="h-3 w-3" />
                                {volunteer.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(volunteer.joined_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{volunteer.verified_hours}</span>
                            <span className="text-sm text-gray-500">verified</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {volunteer.total_hours} total hours
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(volunteer.status)}`}
                        >
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {volunteer.skills.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                              +{volunteer.skills.length - 2}
                            </span>
                          )}
                          {volunteer.skills.length === 0 && (
                            <span className="text-xs text-gray-400 italic">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => handleViewVolunteer(volunteer)}
                            title="View Profile"
                          >
                            <User className="h-5 w-5 text-gray-500" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => handleSendMessage(volunteer.email)}
                            title="Send Email"
                          >
                            <Mail className="h-5 w-5 text-gray-500" />
                          </button>
                          {volunteer.phone && (
                            <a 
                              href={`tel:${volunteer.phone}`}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Call"
                            >
                              <Phone className="h-5 w-5 text-gray-500" />
                            </a>
                          )}
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

      {/* Volunteer Details Modal */}
      {showVolunteerDetails && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Volunteer Profile</h2>
                  <p className="text-gray-500">
                    Detailed information about {selectedVolunteer.name}
                    {usingMockData && ' (Demo Data)'}
                  </p>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowVolunteerDetails(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 py-4">
                <div className="flex flex-col items-center gap-3 lg:w-1/3">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-medium overflow-hidden">
                    {selectedVolunteer.avatar ? (
                      <Image 
                        src={selectedVolunteer.avatar} 
                        alt={selectedVolunteer.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      selectedVolunteer.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{selectedVolunteer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedVolunteer.email}</p>
                    {selectedVolunteer.phone && (
                      <p className="text-sm text-gray-500">{selectedVolunteer.phone}</p>
                    )}
                    {selectedVolunteer.location && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        {selectedVolunteer.location}
                      </div>
                    )}
                  </div>
                  <span 
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedVolunteer.status)}`}
                  >
                    {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="border-b mb-4">
                    <div className="flex">
                      <button
                        className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        Overview
                      </button>
                      <button
                        className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'opportunities' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('opportunities')}
                      >
                        Opportunities
                      </button>
                      <button
                        className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'hours' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('hours')}
                      >
                        Hours
                      </button>
                    </div>
                  </div>
                  
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Volunteer Since</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(selectedVolunteer.joined_date)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Skills & Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedVolunteer.skills.length > 0 ? (
                            selectedVolunteer.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 italic">No skills listed</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedVolunteer.email}</span>
                          </div>
                          {selectedVolunteer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{selectedVolunteer.phone}</span>
                            </div>
                          )}
                          {selectedVolunteer.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{selectedVolunteer.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Performance Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{selectedVolunteer.verified_hours}</div>
                            <div className="text-sm text-green-700">Verified Hours</div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{selectedVolunteer.opportunities.length}</div>
                            <div className="text-sm text-blue-700">Opportunities</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'opportunities' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Current & Past Opportunities</h4>
                      <div className="mt-2 space-y-3">
                        {selectedVolunteer.opportunities.length === 0 ? (
                          <p className="text-sm text-gray-500">No opportunities yet.</p>
                        ) : (
                          selectedVolunteer.opportunities.map((opportunity) => (
                            <div key={opportunity.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium">{opportunity.title}</h5>
                                  <span 
                                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getOpportunityStatusColor(opportunity.status)}`}
                                  >
                                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                                  </span>
                                </div>
                                <Link 
                                  href={usingMockData ? '#' : `/organization/opportunities/${opportunity.id}`}
                                  className={`px-3 py-1 text-sm rounded transition-colors ${
                                    usingMockData 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                  onClick={usingMockData ? (e) => e.preventDefault() : undefined}
                                >
                                  {usingMockData ? 'Demo' : 'View'}
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'hours' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Volunteer Hours</h4>
                        {usingMockData && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Demo Data</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{selectedVolunteer.verified_hours}</div>
                                                        <p className="text-sm text-gray-500">Verified Hours</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{selectedVolunteer.total_hours - selectedVolunteer.verified_hours}</div>
                            <p className="text-sm text-gray-500">Pending Hours</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-700">{selectedVolunteer.total_hours}</div>
                          <p className="text-sm text-gray-500">Total Hours Logged</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-3">Hours Breakdown by Opportunity</h5>
                        <div className="space-y-2">
                          {selectedVolunteer.opportunities.map((opportunity, index) => {
                            // Mock hours distribution
                            const hoursForOpportunity = Math.floor(selectedVolunteer.verified_hours / selectedVolunteer.opportunities.length) + (index === 0 ? selectedVolunteer.verified_hours % selectedVolunteer.opportunities.length : 0);
                            return (
                              <div key={opportunity.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{opportunity.title}</span>
                                <span className="font-medium">{hoursForOpportunity} hours</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Recent Activity</h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Last activity:</span>
                            <span>{formatDate(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average hours per week:</span>
                            <span>{Math.round(selectedVolunteer.total_hours / 12)} hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completion rate:</span>
                            <span>{Math.round((selectedVolunteer.verified_hours / selectedVolunteer.total_hours) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end gap-2">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  onClick={() => handleSendMessage(selectedVolunteer.email)}
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
                {selectedVolunteer.phone && (
                  <a 
                    href={`tel:${selectedVolunteer.phone}`}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setShowVolunteerDetails(false)}
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



