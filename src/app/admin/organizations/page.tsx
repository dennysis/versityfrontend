'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Eye,
  Shield,
  Activity
} from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  description: string;
  contact_email: string;
  location: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
  opportunity_count?: number;
  active_volunteers?: number;
  created_at: string;
}

export default function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getOrganizations();
      const orgsData = response.data?.data || response.data || [];
      setOrganizations(Array.isArray(orgsData) ? orgsData : []);
      
    } catch (apiError: any) {
      console.error("API error:", apiError);
      setError(apiError.response?.data?.detail || 'Failed to load organizations');
      
      // Fallback to mock data for development
      const mockOrganizations: Organization[] = [
        {
          id: 1,
          name: "Community Helpers",
          description: "We help communities in need through various volunteer programs.",
          contact_email: "info@communityhelpers.org",
          location: "New York, NY",
          phone: "555-123-4567",
          status: "active",
          verified: true,
          opportunity_count: 5,
          active_volunteers: 12,
          created_at: "2023-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Animal Rescue League",
          description: "Dedicated to rescuing and rehoming animals in need.",
          contact_email: "contact@animalrescue.org",
          location: "Los Angeles, CA",
          phone: "555-987-6543",
          status: "active",
          verified: true,
          opportunity_count: 8,
          active_volunteers: 25,
          created_at: "2023-02-20T14:15:00Z"
        },
        {
          id: 3,
          name: "Environmental Action",
          description: "Working to protect our environment through community action.",
          contact_email: "info@environmentalaction.org",
          location: "Seattle, WA",
          phone: "555-456-7890",
          status: "inactive",
          verified: false,
          opportunity_count: 2,
          active_volunteers: 3,
          created_at: "2023-03-10T09:45:00Z"
        },
        {
          id: 4,
          name: "Youth Mentorship",
          description: "Mentoring the next generation through educational programs.",
          contact_email: "contact@youthmentorship.org",
          location: "Chicago, IL",
          phone: "555-789-0123",
          status: "active",
          verified: true,
          opportunity_count: 12,
          active_volunteers: 18,
          created_at: "2023-01-05T16:20:00Z"
        },
        {
          id: 5,
          name: "Hunger Relief",
          description: "Fighting hunger in our communities through food distribution.",
          contact_email: "info@hungerrelief.org",
          location: "Houston, TX",
          phone: "555-234-5678",
          status: "suspended",
          verified: true,
          opportunity_count: 3,
          active_volunteers: 7,
          created_at: "2023-04-12T11:30:00Z"
        }
      ];
      
      setOrganizations(mockOrganizations);
      console.log("Using mock data for development");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      org.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesVerification = verificationFilter === 'all' || 
      (verificationFilter === 'verified' && org.verified) ||
      (verificationFilter === 'unverified' && !org.verified);
    
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const showToastNotification = (title: string, description: string, variant: string) => {
    setToastMessage({ title, description, variant });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleViewOrg = (org: Organization) => {
    setSelectedOrg(org);
    setIsViewDialogOpen(true);
  };

  const handleEditOrg = (org: Organization) => {
    setSelectedOrg({ ...org });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrg = (org: Organization) => {
    setSelectedOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveOrg = async () => {
    if (!selectedOrg) return;
    
    try {
      setUpdating(selectedOrg.id);
      await adminAPI.updateOrganization(selectedOrg.id, selectedOrg);
      
      setOrganizations(organizations.map(org => 
        org.id === selectedOrg.id ? selectedOrg : org
      ));
      
      setIsEditDialogOpen(false);
      showToastNotification('Success', 'Organization updated successfully', 'success');
    } catch (err: any) {
      console.error('Failed to update organization:', err);
      showToastNotification('Error', 'Failed to update organization', 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedOrg) return;
    
    try {
      setUpdating(selectedOrg.id);
      await adminAPI.deleteOrganization(selectedOrg.id);
      
      setOrganizations(organizations.filter(org => org.id !== selectedOrg.id));
      setIsDeleteDialogOpen(false);
      showToastNotification('Success', 'Organization deleted successfully', 'success');
    } catch (err: any) {
      console.error('Failed to delete organization:', err);
      showToastNotification('Error', 'Failed to delete organization', 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };

  const handleVerifyOrg = async (orgId: number) => {
    try {
      setUpdating(orgId);
      await adminAPI.verifyOrganization(orgId);
      
      setOrganizations(organizations.map(org => 
        org.id === orgId ? { ...org, verified: true } : org
      ));
      
      setIsDropdownOpen(null);
      showToastNotification('Success', 'Organization verified successfully', 'success');
    } catch (err: any) {
      console.error('Failed to verify organization:', err);
      showToastNotification('Error', 'Failed to verify organization', 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleStatus = async (orgId: number, currentStatus: string) => {
    try {
      setUpdating(orgId);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await adminAPI.updateOrganizationStatus(orgId, newStatus);
      
      setOrganizations(organizations.map(org => 
        org.id === orgId ? { ...org, status: newStatus as 'active' | 'inactive' | 'suspended' } : org
      ));
      
      setIsDropdownOpen(null);
      showToastNotification('Success', `Organization ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err: any) {
      console.error('Failed to update organization status:', err);
      showToastNotification('Error', 'Failed to update organization status', 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600">Manage and monitor all organizations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredOrganizations.length} of {organizations.length} organizations
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchOrganizations}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Verifications</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Organizations Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrganizations.map((org) => (
              <tr key={org.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {org.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(org.status)}`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {org.verified ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-gray-400">
                      <Shield className="h-4 w-4 mr-1" />
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.opportunity_count || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.active_volunteers || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(org.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button onClick={(e) => toggleDropdown(e, org.id)} className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {isDropdownOpen === org.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleViewOrg(org)}
                      >
                        <Eye className="inline-block mr-2 h-4 w-4" /> View
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleEditOrg(org)}
                      >
                        <Edit className="inline-block mr-2 h-4 w-4" /> Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleToggleStatus(org.id, org.status)}
                      >
                        <Activity className="inline-block mr-2 h-4 w-4" />
                        {org.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      {!org.verified && (
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleVerifyOrg(org.id)}
                        >
                          <Shield className="inline-block mr-2 h-4 w-4" /> Verify
                        </button>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteOrg(org)}
                      >
                        <Trash2 className="inline-block mr-2 h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrganizations.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No organizations found.
          </div>
        )}
      </div>
    </div>
  );
}

