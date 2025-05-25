'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

axios.defaults.baseURL = 'https://versity-bck.onrender.com/api';

export default function VolunteerOpportunities() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Convert filters to query params that match the backend expectations
        const params = new URLSearchParams();
        if (filters.search) params.append('title', filters.search); // Changed from 'search' to 'title'
        if (filters.location) params.append('location', filters.location);
        
        // Convert page to skip/limit for backend pagination
        const limit = 10;
        const skip = (pagination.page - 1) * limit;
        params.append('skip', skip.toString());
        params.append('limit', limit.toString());
        
        // Add auth header if user is logged in
        const config = user ? { 
          headers: { Authorization: `Bearer ${user.token}` } 
        } : {};
        
      const response = await axios.get(`/opportunities/?${params.toString()}`, config);

            // Handle different response formats
            if (Array.isArray(response.data)) {
            // If backend returns just an array
            setOpportunities(response.data);
            setPagination({
                page: pagination.page,
                totalPages: Math.ceil(response.data.length / limit) || 1,
                totalItems: response.data.length,
            });
            } else if (response.data.items) {
            // If backend returns structured response
            setOpportunities(response.data.items);
            setPagination({
                page: response.data.page,
                totalPages: response.data.totalPages,
                totalItems: response.data.totalItems,
            });
            }

      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    // Since /api/categories and /api/locations don't exist in the backend,
    // we'll use hardcoded values or skip these requests
    const mockCategories = [
      { id: 'education', name: 'Education' },
      { id: 'health', name: 'Health & Wellness' },
      { id: 'environment', name: 'Environment' },
      { id: 'community', name: 'Community Service' },
    ];
    
    const mockLocations = [
      'Remote',
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
    ];
    
    setCategories(mockCategories);
    setLocations(mockLocations);

    fetchOpportunities();
  }, [filters, pagination.page, user]);

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

  const handleApply = async (opportunityId) => {
    if (!user) {
      router.push('/login?redirect=/volunteer/opportunities');
      return;
    }
    try {
      // Add auth header for authenticated request
    await axios.post('/matches/', // This will become http://localhost:8000/api/matches/
  { opportunity_id: opportunityId },
  { headers: { Authorization: `Bearer ${user.token || localStorage.getItem('accessToken')}` } }
);
      // Show success message or redirect
      router.push(`/volunteer/applications`);
    } catch (error) {
      console.error('Error applying for opportunity:', error);
      // Show error message
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Volunteer Opportunities</h1>
      
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
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
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
    </div>
  );
}
