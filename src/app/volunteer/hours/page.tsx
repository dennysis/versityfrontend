'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VolunteerHours() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunity');
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(opportunityId || '');
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    hours: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    totalHours: 0,
    pendingHours: 0,
    verifiedHours: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchAcceptedOpportunities = async () => {
      try {
        // Fix: Remove the duplicate "api" in the URL path
        const response = await axios.get('/matches/', {
          params: { status: 'ACCEPTED' } // Note: Using uppercase to match backend enum
        });
        const acceptedOpportunities = response.data.map(match => match.opportunity);
        setOpportunities(acceptedOpportunities);

        // If opportunityId is provided in URL and exists in accepted opportunities, select it
        if (opportunityId) {
          const exists = acceptedOpportunities.some(opp => opp.id.toString() === opportunityId);
          if (exists) {
            setSelectedOpportunity(opportunityId);
          }
        }
      } catch (error) {
        console.error('Error fetching accepted opportunities:', error);
      }
    };

    const fetchHours = async () => {
      try {
        // Fix: Remove the duplicate "api" in the URL path
        const response = await axios.get(`/volunteers/${user.id}/hours`);
        setHours(response.data);

        // Calculate statistics
        const total = response.data.reduce((sum, entry) => sum + entry.hours, 0);
        const verified = response.data
          .filter(entry => entry.verified)
          .reduce((sum, entry) => sum + entry.hours, 0);
        const pending = total - verified;

        setStats({
          totalHours: total,
          verifiedHours: verified,
          pendingHours: pending,
        });
      } catch (error) {
        console.error('Error fetching hours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedOpportunities();
    fetchHours();
  }, [user, opportunityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) {
      setMessage({ type: 'error', text: 'Please select an opportunity' });
      return;
    }

    try {
      const payload = {
        opportunity_id: parseInt(selectedOpportunity),
        hours: parseFloat(formData.hours),
        date: new Date(formData.date).toISOString(),
        description: formData.description,
      };

      // Fix: Use the correct endpoint for logging hours
      const response = await axios.post('/hour-tracking/', payload);

      // Add the new entry to the hours list
      setHours(prev => [response.data, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalHours: prev.totalHours + parseFloat(formData.hours),
        pendingHours: prev.pendingHours + parseFloat(formData.hours),
      }));

      // Reset form
      setFormData({
        hours: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      setMessage({ 
        type: 'success', 
        text: 'Hours logged successfully! They will be verified by the organization.' 
      });
    } catch (error) {
      console.error('Error logging hours:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to log hours. Please try again.' 
      });
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Volunteer Hours</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.verifiedHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Log Hours Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Log New Hours</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="opportunity" className="block text-sm font-medium text-gray-700 mb-1">
              Select Opportunity
            </label>
            <select
              id="opportunity"
              name="opportunity"
              value={selectedOpportunity}
              onChange={(e) => setSelectedOpportunity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select an opportunity</option>
              {opportunities.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.title} - {opportunity.organization_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                id="hours"
                name="hours"
                min="0.5"
                step="0.5"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="e.g. 2.5"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description of Work
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Briefly describe what you did"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log Hours
            </button>
          </div>
        </form>
      </div>
      
      {/* Hours History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Hours History</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : hours.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hours.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/opportunities/${entry.opportunity.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {entry.opportunity.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.hours.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
                        </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">You haven't logged any volunteer hours yet.</p>
            {opportunities.length > 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                Use the form above to log hours for your accepted opportunities.
              </p>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-4">
                  You don't have any accepted opportunities yet. Apply for opportunities to start volunteering.
                </p>
                <Link
                  href="/volunteer/opportunities"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Opportunities
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
