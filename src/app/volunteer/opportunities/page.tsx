'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { opportunitiesAPI, matchesAPI } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock data for development/fallback
const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    title: "Community Garden Volunteer",
    description: "Help maintain our community garden by planting, weeding, and harvesting fresh produce for local food banks. Perfect for those who love working outdoors and want to make a direct impact on food security in our community.",
    organization_name: "Green City Initiative",
    location: "Central Park Community Garden, NYC",
    is_remote: false,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    skills_required: "Gardening, Physical Labor, Teamwork",
    category: "Environment",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Online Math Tutoring",
    description: "Provide one-on-one math tutoring to high school students via video calls. Help students improve their grades and build confidence in mathematics. Flexible scheduling available.",
    organization_name: "Education First",
    location: "Remote",
    is_remote: true,
    start_date: "2024-01-20",
    end_date: "2024-06-15",
    skills_required: "Mathematics, Teaching, Communication",
    category: "Education",
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: 3,
    title: "Senior Center Technology Helper",
    description: "Assist elderly residents with using smartphones, tablets, and computers. Teach basic digital literacy skills and help seniors stay connected with their families through technology.",
    organization_name: "Silver Years Community Center",
    location: "Downtown Senior Center, Chicago",
    is_remote: false,
    start_date: "2024-02-05",
    end_date: "2024-12-31",
    skills_required: "Technology, Patience, Communication",
    category: "Community Service",
    created_at: "2024-01-12T09:15:00Z"
  },
  {
    id: 4,
    title: "Animal Shelter Dog Walker",
    description: "Walk and socialize dogs at our animal shelter. Help provide exercise and human interaction for dogs waiting for their forever homes. Training provided for new volunteers.",
    organization_name: "Paws & Hearts Animal Rescue",
    location: "Westside Animal Shelter, Los Angeles",
    is_remote: false,
    start_date: "2024-01-25",
    end_date: "2024-12-31",
    skills_required: "Animal Care, Physical Fitness, Reliability",
    category: "Animal Welfare",
    created_at: "2024-01-08T16:45:00Z"
  },
  {
    id: 5,
    title: "Virtual Reading Buddy",
    description: "Read stories to children via video calls to promote literacy and love of reading. Perfect for those who enjoy working with kids but prefer remote volunteering opportunities.",
    organization_name: "Read Together Foundation",
    location: "Remote",
    is_remote: true,
    start_date: "2024-02-01",
    end_date: "2024-07-31",
    skills_required: "Reading, Communication, Child Interaction",
    category: "Education",
    created_at: "2024-01-14T11:20:00Z"
  },
  {
    id: 6,
    title: "Food Bank Volunteer",
    description: "Sort donations, pack food boxes, and help distribute meals to families in need. Join our team in fighting hunger in the local community. Various shifts available.",
    organization_name: "Community Food Network",
    location: "Central Food Bank, Houston",
    is_remote: false,
    start_date: "2024-01-30",
    end_date: "2024-12-31",
    skills_required: "Organization, Physical Labor, Teamwork",
    category: "Community Service",
    created_at: "2024-01-11T13:10:00Z"
  },
  {
    id: 7,
    title: "Beach Cleanup Coordinator",
    description: "Help organize and lead monthly beach cleanup events. Coordinate with volunteers, manage supplies, and track environmental impact data. Leadership experience preferred.",
    organization_name: "Ocean Guardians",
    location: "Santa Monica Beach, CA",
    is_remote: false,
    start_date: "2024-02-10",
    end_date: "2024-10-31",
    skills_required: "Leadership, Organization, Environmental Awareness",
    category: "Environment",
    created_at: "2024-01-09T08:30:00Z"
  },
  {
    id: 8,
    title: "Crisis Text Line Counselor",
    description: "Provide emotional support to people in crisis via text messaging. Complete our comprehensive training program and help save lives from anywhere with an internet connection.",
    organization_name: "Crisis Support Network",
    location: "Remote",
    is_remote: true,
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    skills_required: "Empathy, Communication, Crisis Management",
    category: "Mental Health",
    created_at: "2024-01-13T15:45:00Z"
  }
];

export default function VolunteerOpportunities() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    remote: searchParams.get('remote') === 'true',
    dateRange: searchParams.get('dateRange') || '',
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalItems: 0,
  });

  // Filter mock data based on current filters
  const filterMockData = (data, filters) => {
    let filtered = [...data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower) ||
        opp.organization_name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(opp => 
        opp.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.remote) {
      filtered = filtered.filter(opp => opp.is_remote === true);
    }

    return filtered;
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        
        // Convert filters to API params object
        const apiParams = {};
        if (filters.search) apiParams.search = filters.search;
        if (filters.category) apiParams.category = filters.category;
        if (filters.location) apiParams.location = filters.location;
        if (filters.remote) apiParams.remote = true;
        if (filters.dateRange) apiParams.dateRange = filters.dateRange;
        
        // Add pagination
        const limit = 10;
        const skip = (pagination.page - 1) * limit;
        apiParams.skip = skip;
        apiParams.limit = limit;
        
        console.log('Fetching opportunities with params:', apiParams);
        
        try {
          // Try to fetch from API first
          const response = await opportunitiesAPI.getAll(apiParams);
          console.log('API Response:', response.data);
          
          // Handle different response formats
          if (Array.isArray(response.data)) {
            setOpportunities(response.data);
            setPagination({
              page: pagination.page,
              totalPages: Math.ceil(response.data.length / limit) || 1,
              totalItems: response.data.length,
            });
          } else if (response.data.items) {
            setOpportunities(response.data.items);
            setPagination({
              page: response.data.page || pagination.page,
              totalPages: response.data.totalPages || 1,
              totalItems: response.data.totalItems || 0,
            });
          } else {
            setOpportunities(response.data);
            setPagination({
              page: pagination.page,
              totalPages: 1,
              totalItems: response.data.length || 0,
            });
          }
          setUsingMockData(false);
          
        } catch (apiError) {
          console.warn('API failed, using mock data:', apiError);
          
          // Use mock data as fallback
          const filteredMockData = filterMockData(MOCK_OPPORTUNITIES, filters);
          const startIndex = (pagination.page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = filteredMockData.slice(startIndex, endIndex);
          
          setOpportunities(paginatedData);
          setPagination({
            page: pagination.page,
            totalPages: Math.ceil(filteredMockData.length / limit) || 1,
            totalItems: filteredMockData.length,
          });
          setUsingMockData(true);
        }

      } catch (error) {
        console.error('Error fetching opportunities:', error);
        
        // Final fallback to mock data
        const filteredMockData = filterMockData(MOCK_OPPORTUNITIES, filters);
        setOpportunities(filteredMockData);
        setPagination({
          page: 1,
          totalPages: 1,
          totalItems: filteredMockData.length,
        });
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    // Set mock data for categories and locations
    const mockCategories = [
      { id: 'education', name: 'Education' },
      { id: 'health', name: 'Health & Wellness' },
      { id: 'environment', name: 'Environment' },
      { id: 'community service', name: 'Community Service' },
      { id: 'animal welfare', name: 'Animal Welfare' },
      { id: 'mental health', name: 'Mental Health' },
    ];
    
    const mockLocations = [
      'Remote',
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Santa Monica',
    ];
    
    setCategories(mockCategories);
    setLocations(mockLocations);

    fetchOpportunities();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with current filters for shareable links
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote) params.append('remote', 'true');
    if (filters.dateRange) params.append('dateRange', filters.dateRange);
    router.push(`/volunteer/opportunities?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    // Update URL with page number
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/volunteer/opportunities?${params.toString()}`);
  };

  const handleApply = async (opportunityId: number) => {
    if (!user) {
      router.push('/login?redirect=/volunteer/opportunities');
      return;
    }
    
    try {
      if (usingMockData) {
        // Simulate application for mock data
        alert('Application submitted successfully! (Demo mode)');
        return;
      }
      
      await matchesAPI.apply(opportunityId);
      alert('Application submitted successfully!');
      router.push(`/volunteer/applications`);
    } catch (error) {
      console.error('Error applying for opportunity:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Volunteer Opportunities</h1>
        {usingMockData && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
            
          </div>
        )}
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search opportunities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4">
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                id="dateRange"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={filters.remote}
                onChange={handleFilterChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">Remote Opportunities</label>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">
            {pagination.totalItems} {pagination.totalItems === 1 ? 'Opportunity' : 'Opportunities'} Found
            {usingMockData && <span className="text-sm text-gray-500 ml-2">(Demo Data)</span>}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : opportunities.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-indigo-600">
                      <Link href={`/opportunities/${opportunity.id}`} className="hover:underline">
                        {opportunity.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {opportunity.organization_name || 'Organization'} • {opportunity.location || 'Location'}
                      {opportunity.is_remote && ' • Remote'}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {opportunity.start_date ? new Date(opportunity.start_date).toLocaleDateString() : 'Start Date'} - 
                      {opportunity.end_date ? new Date(opportunity.end_date).toLocaleDateString() : 'End Date'}
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {opportunity.description || 'No description available'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {opportunity.skills_required && opportunity.skills_required.split(',').map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {opportunity.category || 'General'}
                      </span>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => handleApply(opportunity.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No opportunities found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  location: '',
                  remote: false,
                  dateRange: '',
                });
                router.push('/volunteer/opportunities');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.page === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.page === pagination.totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * 10, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    // Show current page, first and last pages, and one page before and after current
                                        const shouldShowPage = 
                      pageNumber === 1 || 
                      pageNumber === pagination.totalPages || 
                      Math.abs(pageNumber - pagination.page) <= 1;
                    
                    // Show ellipsis for gaps
                    if (!shouldShowPage) {
                      // Show ellipsis only once between gaps
                      if (pageNumber === 2 || pageNumber === pagination.totalPages - 1) {
                        return (
                          <span key={`ellipsis-${pageNumber}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNumber
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner for Demo Mode */}
      {usingMockData && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Demo Mode Active
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You're viewing sample volunteer opportunities. The backend API is currently unavailable, 
                  so we're showing demo data to showcase the application's functionality. 
                  All features are working, but applications won't be saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
