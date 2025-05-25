'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAnalytics();
        setReportData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isExportDropdownOpen) {
        setIsExportDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExportDropdownOpen]);

  const handleExportReport = (format: string) => {
    // Implementation would depend on your API structure
    console.log(`Exporting report in ${format} format`);
    setIsExportDropdownOpen(false);
  };

  const toggleExportDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExportDropdownOpen(!isExportDropdownOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={toggleExportDropdown}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleExportReport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExportReport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'hours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Volunteer Hours
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="pb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">{reportData?.users?.total || 0}</div>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="font-medium text-blue-600">{reportData?.users?.volunteers || 0}</span> Volunteers, 
                  <span className="font-medium text-green-600"> {reportData?.users?.organizations || 0}</span> Organizations, 
                  <span className="font-medium text-purple-600"> {reportData?.users?.admins || 0}</span> Admins
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="pb-2">
                <h3 className="text-sm font-medium text-gray-500">Opportunities</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">{reportData?.opportunities?.total || 0}</div>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="font-medium text-green-600">{reportData?.opportunities?.active || 0}</span> Active Opportunities
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="pb-2">
                <h3 className="text-sm font-medium text-gray-500">Volunteer Hours</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">{reportData?.volunteer_hours?.total || 0}</div>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="font-medium text-green-600">{reportData?.volunteer_hours?.verified || 0}</span> Verified Hours
                  ({reportData?.volunteer_hours?.verification_rate || 0}% Verification Rate)
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Volunteers</span>
                    <span className="text-sm font-medium">{reportData?.users?.volunteers || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.volunteers / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Organizations</span>
                    <span className="text-sm font-medium">{reportData?.users?.organizations || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.organizations / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Admins</span>
                    <span className="text-sm font-medium">{reportData?.users?.admins || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.admins / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Top Skills</h3>
              {reportData?.top_skills && reportData.top_skills.length > 0 ? (
                <div className="space-y-4">
                  {reportData.top_skills.map((skill: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <span className="text-sm font-medium">{skill.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.max(...reportData.top_skills.map((s: any) => s.count)) ? (skill.count / Math.max(...reportData.top_skills.map((s: any) => s.count))) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skill data available</p>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData?.recent_activity?.users?.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData?.recent_activity?.users?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No recent user activity</div>
              )}
            </div>
          </div>
        </>
      )}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Users Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium mb-3">User Growth</h4>
              <p className="text-gray-500 mb-4">Total users: {reportData?.users?.total || 0}</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Volunteers</span>
                    <span className="text-sm font-medium">{reportData?.users?.volunteers || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.volunteers / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Organizations</span>
                    <span className="text-sm font-medium">{reportData?.users?.organizations || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.organizations / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Admins</span>
                    <span className="text-sm font-medium">{reportData?.users?.admins || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.users?.total ? (reportData.users.admins / reportData.users.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Recent Users</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData?.recent_activity?.users?.slice(0, 5).map((user: any) => (
                      <tr key={user.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Opportunities Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium mb-3">Opportunity Statistics</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Opportunities</p>
                  <p className="text-2xl font-bold">{reportData?.opportunities?.total || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Active Opportunities</p>
                  <p className="text-2xl font-bold">{reportData?.opportunities?.active || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Application Rate</p>
                  <p className="text-2xl font-bold">
                    {reportData?.opportunities?.total && reportData?.matches?.total 
                      ? ((reportData.matches.total / reportData.opportunities.total) * 100).toFixed(1) + '%'
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Recent Opportunities</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData?.recent_activity?.opportunities?.map((opportunity: any) => (
                      <tr key={opportunity.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {opportunity.title}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          Organization ID: {opportunity.organization_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hours' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Volunteer Hours Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium mb-3">Hours Overview</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold">{reportData?.volunteer_hours?.total || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Verified Hours</p>
                  <p className="text-2xl font-bold">{reportData?.volunteer_hours?.verified || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Verification Rate</p>
                  <p className="text-2xl font-bold">{reportData?.volunteer_hours?.verification_rate || 0}%</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-3">Hours Verification</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Verification Progress</span>
                    <span className="text-sm font-medium">{reportData?.volunteer_hours?.verification_rate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${reportData?.volunteer_hours?.verification_rate || 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  {reportData?.volunteer_hours?.verified || 0} out of {reportData?.volunteer_hours?.total || 0} hours have been verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
