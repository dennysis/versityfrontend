"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock3,
  Plus,
  FolderKanban,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { organizationsAPI, matchesAPI, opportunitiesAPI, hoursAPI, authAPI } from "@/lib/api";

// Mock data for organization dashboard
const MOCK_ORGANIZATION_DATA = {
  organization: {
    id: 1,
    name: "Ocean Conservation Society",
    description: "Dedicated to protecting marine ecosystems through community action and education.",
    contact_email: "info@oceanconservation.org",
    location: "Santa Monica, CA",
    avatar: null,
    website: "https://oceanconservation.org",
    phone: "+1 (555) 987-6543",
    founded: "2015"
  },
  stats: {
    total_volunteers: 45,
    active_opportunities: 8,
    total_hours: 1250,
    pending_applications: 12
  },
  recent_volunteers: [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: null,
      joined_date: "2024-01-25T10:00:00Z",
      skills: ["Teaching", "Event Planning"]
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: null,
      joined_date: "2024-01-23T14:30:00Z",
      skills: ["Photography", "Social Media"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: null,
      joined_date: "2024-01-20T09:15:00Z",
      skills: ["First Aid", "Logistics"]
    }
  ],
  upcoming_opportunities: [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      start_date: "2024-02-15T09:00:00Z",
      applications_count: 18,
      volunteers_needed: 25,
      location: "Santa Monica Beach"
    },
    {
      id: 2,
      title: "Marine Life Education Workshop",
      start_date: "2024-02-28T10:00:00Z",
      applications_count: 12,
      volunteers_needed: 15,
      location: "Santa Monica Pier Aquarium"
    },
    {
      id: 3,
      title: "Coastal Restoration Project",
      start_date: "2024-03-05T08:00:00Z",
      applications_count: 8,
      volunteers_needed: 20,
      location: "Malibu Creek State Park"
    }
  ],
  applications: {
    pending: 12,
    accepted: 28,
    rejected: 5
  },
  hours_by_month: [
    { month: "Aug", hours: 85 },
    { month: "Sep", hours: 120 },
    { month: "Oct", hours: 95 },
    { month: "Nov", hours: 140 },
    { month: "Dec", hours: 110 },
    { month: "Jan", hours: 160 }
  ],
  recent_activities: [
    {
      id: 1,
      type: "application",
      message: "New application for Beach Cleanup Drive",
      timestamp: "2024-01-28T14:30:00Z"
    },
    {
      id: 2,
      type: "volunteer_joined",
      message: "Sarah Johnson joined as a volunteer",
      timestamp: "2024-01-25T10:00:00Z"
    },
    {
      id: 3,
      type: "hours_logged",
      message: "15 volunteer hours verified",
      timestamp: "2024-01-24T16:45:00Z"
    }
  ]
};

// Types
interface DashboardData {
  organization: {
    name: string;
    avatar: string | null;
  };
  stats: {
    total_volunteers: number;
    active_opportunities: number;
    total_hours: number;
    pending_applications: number;
  };
  recent_volunteers: {
    id: number;
    name: string;
    avatar: string | null;
    joined_date: string;
  }[];
  upcoming_opportunities: {
    id: number;
    title: string;
    start_date: string;
    applications_count: number;
  }[];
  applications: {
    pending: number;
    accepted: number;
    rejected: number;
  };
  hours_by_month: {
    month: string;
    hours: number;
  }[];
}

export default function OrganizationDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' });
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [useMockData, setUseMockData] = useState(false);

  // Check connection status
  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      await authAPI.getCurrentUser();
      setConnectionStatus('online');
      return true;
    } catch (error) {
      setConnectionStatus('offline');
      return false;
    }
  };

  // Load mock data
  const loadMockData = () => {
    setLoading(true);
    setError(null);
    setUseMockData(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const mockData: DashboardData = {
        organization: {
          name: MOCK_ORGANIZATION_DATA.organization.name,
          avatar: MOCK_ORGANIZATION_DATA.organization.avatar,
        },
        stats: MOCK_ORGANIZATION_DATA.stats,
        recent_volunteers: MOCK_ORGANIZATION_DATA.recent_volunteers,
        upcoming_opportunities: MOCK_ORGANIZATION_DATA.upcoming_opportunities,
        applications: MOCK_ORGANIZATION_DATA.applications,
        hours_by_month: MOCK_ORGANIZATION_DATA.hours_by_month,
      };
      
      setData(mockData);
      setConnectionStatus('online');
      setLoading(false);
      showToastNotification("Mock Data Loaded", "Using sample data for demonstration", "success");
    }, 1000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUseMockData(false);

        // First check if we can connect to the backend
        const isConnected = await checkConnection();
        if (!isConnected) {
          // Automatically load mock data if connection fails
          console.log("Connection failed, loading mock data...");
          loadMockData();
          return;
        }

        // Fetch data from multiple endpoints
        const [
          currentUserResponse,
          dashboardResponse,
          applicationsResponse,
          opportunitiesResponse,
          volunteersResponse
        ] = await Promise.allSettled([
          authAPI.getCurrentUser(),
          organizationsAPI.getDashboard(),
          matchesAPI.getAll(),
          opportunitiesAPI.getAll(),
          organizationsAPI.getVolunteers()
        ]);

        // Process the responses
        let dashboardData: DashboardData = {
          organization: {
            name: "Your Organization",
            avatar: null,
          },
          stats: {
            total_volunteers: 0,
            active_opportunities: 0,
            total_hours: 0,
            pending_applications: 0,
          },
          recent_volunteers: [],
          upcoming_opportunities: [],
          applications: {
            pending: 0,
            accepted: 0,
            rejected: 0,
          },
          hours_by_month: [],
        };

        // Handle current user data
        if (currentUserResponse.status === 'fulfilled') {
          const userData = currentUserResponse.value.data;
          dashboardData.organization.name = userData.organization?.name || "Your Organization";
          dashboardData.organization.avatar = userData.organization?.avatar || null;
        }

        // Handle dashboard data if available
        if (dashboardResponse.status === 'fulfilled') {
          const dashboard = dashboardResponse.value.data;
          dashboardData = { ...dashboardData, ...dashboard };
        } else {
          // Fallback: construct dashboard data from individual API calls
          
          // Process applications data
          if (applicationsResponse.status === 'fulfilled') {
            const applications = applicationsResponse.value.data;
            dashboardData.stats.pending_applications = applications.filter((app: any) => app.status === 'pending').length;
            dashboardData.applications = {
              pending: applications.filter((app: any) => app.status === 'pending').length,
              accepted: applications.filter((app: any) => app.status === 'accepted').length,
              rejected: applications.filter((app: any) => app.status === 'rejected').length,
            };
          }

          // Process opportunities data
          if (opportunitiesResponse.status === 'fulfilled') {
            const opportunities = opportunitiesResponse.value.data;
            dashboardData.stats.active_opportunities = opportunities.length;
            
            // Get upcoming opportunities
            const upcoming = opportunities
              .filter((opp: any) => new Date(opp.start_date) > new Date())
              .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
              .slice(0, 3)
              .map((opp: any) => ({
                id: opp.id,
                title: opp.title,
                start_date: opp.start_date,
                applications_count: opp.applications_count || 0
              }));
            
            dashboardData.upcoming_opportunities = upcoming;
          }

          // Process volunteers data
          if (volunteersResponse.status === 'fulfilled') {
            const volunteers = volunteersResponse.value.data;
            dashboardData.stats.total_volunteers = volunteers.length;
            
            // Get recent volunteers
            const recent = volunteers
              .sort((a: any, b: any) => new Date(b.joined_date).getTime() - new Date(a.joined_date).getTime())
              .slice(0, 3)
              .map((vol: any) => ({
                id: vol.id,
                name: vol.name || vol.full_name || `${vol.first_name} ${vol.last_name}`,
                avatar: vol.avatar,
                joined_date: vol.joined_date || vol.created_at
              }));
            
            dashboardData.recent_volunteers = recent;
          }

          // Generate mock hours data for now (you can replace with real API call)
          dashboardData.hours_by_month = [
            { month: "Aug", hours: 45 },
            { month: "Sep", hours: 60 },
            { month: "Oct", hours: 75 },
            { month: "Nov", hours: 90 },
            { month: "Dec", hours: 120 },
            { month: "Jan", hours: 66 },
          ];
          dashboardData.stats.total_hours = dashboardData.hours_by_month.reduce((sum, item) => sum + item.hours, 0);
        }

        setData(dashboardData);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        
        // Automatically load mock data on any error
        console.log("API error, loading mock data...");
        loadMockData();
        return;
      } finally {
        if (!useMockData) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const showToastNotification = (title: string, description: string, variant: string) => {
    setToastMessage({ title, description, variant });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Connection status indicator
  const ConnectionIndicator = () => (
    <div className={`flex items-center gap-2 text-sm ${
      connectionStatus === 'online' ? 'text-green-600' : 
      connectionStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
    }`}>
      {connectionStatus === 'online' ? <Wifi className="h-4 w-4" /> : 
       connectionStatus === 'offline' ? <WifiOff className="h-4 w-4" /> : 
       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-500"></div>}
      <span>
        {connectionStatus === 'online' ? (useMockData ? 'Mock Data' : 'Connected') : 
         connectionStatus === 'offline' ? 'Disconnected' : 'Checking connection...'}
      </span>
    </div>
  );

  // Calculate total applications for percentage
  const totalApplications = data
    ? data.applications.pending + data.applications.accepted + data.applications.rejected
    : 0;

  // Calculate percentages for pie chart
  const pendingPercentage = data && totalApplications > 0
    ? Math.round((data.applications.pending / totalApplications) * 100)
    : 0;
  
  const acceptedPercentage = data && totalApplications > 0
    ? Math.round((data.applications.accepted / totalApplications) * 100)
    : 0;
  
  const rejectedPercentage = data && totalApplications > 0
    ? Math.round((data.applications.rejected / totalApplications) * 100)
    : 0;

  // Find max hours for bar chart scaling
  const maxHours = data
    ? Math.max(...data.hours_by_month.map(item => item.hours))
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <ConnectionIndicator />
        </div>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Error loading dashboard</p>
          </div>
        </div>
        <div className="text-center p-8 border rounded bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">Failed to load dashboard data</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          
          <ConnectionIndicator />
          
          <div className="mt-4 flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button 
              onClick={loadMockData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load Mock Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p>No dashboard data available.</p>
        <button 
          onClick={loadMockData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load Mock Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          toastMessage.variant === 'success' ? 'bg-green-50 border border-green-200' : 
          toastMessage.variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                toastMessage.variant === 'success' ? 'text-green-800' : 
                toastMessage.variant === 'destructive' ? 'text-red-800' : 'text-blue-800'
              }`}>
                {toastMessage.title}
              </h3>
              <div className={`mt-1 text-sm ${
                toastMessage.variant === 'success' ? 'text-green-700' : 
                toastMessage.variant === 'destructive' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {toastMessage.description}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight animate-fade-in">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back to {data.organization.name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ConnectionIndicator />
          {!useMockData && (
            <button 
              onClick={loadMockData}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
            >
              Use Mock Data
            </button>
          )}
          <Link href="/organization/opportunities/new">
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus className="mr-2 h-4 w-4" />
              New Opportunity
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white shadow">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            <h3 className="text-sm font-medium text-gray-800">Total Volunteers</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {data.stats.total_volunteers}
            </div>
            <p className="text-xs text-gray-500">
              People helping your cause
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            <h3 className="text-sm font-medium text-gray-800">Active Opportunities</h3>
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {data.stats.active_opportunities}
            </div>
            <p className="text-xs text-gray-500">
              Current volunteer positions
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            <h3 className="text-sm font-medium text-gray-800">Total Hours</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">{data.stats.total_hours}</div>
            <p className="text-xs text-gray-500">
              Volunteer hours contributed
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            <h3 className="text-sm font-medium text-gray-800">Pending Applications</h3>
            <Award className="h-4 w-4 text-gray-400" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {data.stats.pending_applications}
            </div>
            <p className="text-xs text-gray-500">
              Waiting for your review
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Monthly Volunteer Hours Chart */}
        <div className="rounded-lg border bg-white shadow-md lg:col-span-4">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <span role="img" aria-label="chart">📊</span> Monthly Volunteer Hours
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data.hours_by_month.map((item) => {
                const widthPercent = maxHours > 0 ? (item.hours / maxHours) * 100 : 0;
                return (
                  <div key={item.month} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium w-14 text-gray-700">{item.month}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden shadow-inner">
                      <div
                        className="h-4 bg-blue-600 rounded transition-all duration-700 ease-in-out"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">{item.hours}h</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Applications Breakdown */}
        <div className="rounded-2xl border bg-white shadow-lg lg:col-span-3">
          <div className="p-6 border-b bg-gray-50 rounded-t-2xl">
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-indigo-600" />
              Applications Breakdown
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{data.applications.pending}</span>
                <span className="text-xs text-gray-500 ml-1">({pendingPercentage}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Accepted</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{data.applications.accepted}</span>
                <span className="text-xs text-gray-500 ml-1">({acceptedPercentage}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{data.applications.rejected}</span>
                <span className="text-xs text-gray-500 ml-1">({rejectedPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Opportunities & Recent Volunteers */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Opportunities */}
        <div className="rounded-lg border bg-white shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
              📅 Upcoming Opportunities
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {data.upcoming_opportunities.length > 0 ? (
              data.upcoming_opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{opp.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(opp.start_date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">{opp.applications_count} apps</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming opportunities</p>
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="rounded-lg border bg-white shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
              👥 Recent Volunteers
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {data.recent_volunteers.length > 0 ? (
              data.recent_volunteers.map((vol) => (
                <div key={vol.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  {vol.avatar ? (
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                      {vol.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{vol.name}</p>
                    <p className="text-xs text-gray-500">Joined {formatDate(vol.joined_date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent volunteers</p>
            )}
          </div>
        </div>
      </div>

      {/* Mock Data Indicator */}
      {useMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 text-sm">
              <strong>Demo Mode:</strong> You're viewing sample data. This demonstrates how your dashboard will look with real data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


