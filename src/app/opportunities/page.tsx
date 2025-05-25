'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { opportunitiesAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const searchParams = useSearchParams();
  
  // Get organization_id from URL if present
  const organizationId = searchParams.get('organization');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        let response;
        
        // Only include organization_id in the request if it exists
        if (organizationId) {
          response = await opportunitiesAPI.getByOrganization(organizationId);
        } else {
          response = await opportunitiesAPI.getAll();
        }
        
        // Ensure we're setting an array, even if the API returns null or undefined
        const opportunitiesData = response?.data || [];
        
        // Make sure we're setting an array
        setOpportunities(Array.isArray(opportunitiesData) ? opportunitiesData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities');
        // Initialize with empty array on error
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [organizationId]);

  // Safely filter opportunities (ensuring it's an array first)
  const filteredOpportunities = Array.isArray(opportunities) 
    ? opportunities.filter(opp => {
        const matchesSearch = 
          (opp.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
          (opp.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || opp.category === categoryFilter;
        const matchesLocation = locationFilter === 'all' || opp.location === locationFilter;
        
        return matchesSearch && matchesCategory && matchesLocation;
      })
    : [];

  // Extract unique categories and locations for filters (safely)
  const categories = ['all', ...new Set(
    Array.isArray(opportunities) 
      ? opportunities.filter(opp => opp.category).map(opp => opp.category)
      : []
  )];
  
  const locations = ['all', ...new Set(
    Array.isArray(opportunities) 
      ? opportunities.filter(opp => opp.location).map(opp => opp.location)
      : []
  )];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Volunteer Opportunities</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find meaningful volunteer opportunities that match your skills and interests.
          Make a difference in your community today.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        {/* Category Filter */}
        <div className="relative md:w-1/3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        {/* Location Filter */}
        <div className="relative md:w-1/3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location === 'all' ? 'All Locations' : location}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{opportunity.title}</h2>
                  {opportunity.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {opportunity.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{opportunity.organization_name}</p>
                
                <div className="mt-4 flex-grow">
                  <p className="text-gray-700 line-clamp-3">{opportunity.description}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {opportunity.location && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {opportunity.location}
                    </span>
                  )}
                  {opportunity.start_date && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(opportunity.start_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-6 pb-6 mt-auto">
                <Link href={`/opportunities/${opportunity.id}`}>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No opportunities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
