"use client";

import React, { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from "react";
import { adminAPI, opportunitiesAPI } from "@/lib/api";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  skills_required: string;
  start_date: string;
  end_date: string;
  location: string;
  organization_name: string;
  organization_id: number;
  status: string;
  applications_count: number;
  created_at?: string;
}

export default function OpportunitiesManagement() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🎯 Use adminAPI.getAllOpportunities() instead of opportunitiesAPI.getAll()
        const response = await adminAPI.getAllOpportunities();
        
        // Check the structure of the response and extract the array of opportunities
        let opportunitiesArray: Opportunity[] = [];
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            opportunitiesArray = response.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            opportunitiesArray = response.data.items;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            opportunitiesArray = response.data.data;
          } else if (typeof response.data === 'object') {
            // If it's an object with opportunity data, convert to array
            opportunitiesArray = Object.values(response.data);
          }
        }
        
        setOpportunities(opportunitiesArray);
        setError(null);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.response?.data?.detail || "Failed to load opportunities");
        
        // Fallback to mock data for development
        const mockOpportunities: Opportunity[] = [
          {
            id: 1,
            title: "Community Garden Helper",
            description: "Help maintain our community garden by planting, watering, and harvesting vegetables.",
            skills_required: "Gardening, Physical labor",
            start_date: "2024-06-01T00:00:00Z",
            end_date: "2024-08-31T00:00:00Z",
            location: "Community Garden, 123 Park Ave",
            organization_name: "Green Community",
            organization_id: 1,
            status: "active",
            applications_count: 5,
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            title: "Food Bank Assistant",
            description: "Help sort and distribute food at our local food bank.",
            skills_required: "Organization, Customer service",
            start_date: "2024-05-15T00:00:00Z",
            end_date: "2024-12-31T00:00:00Z",
            location: "City Food Bank, 456 Main St",
            organization_name: "Hunger Relief",
            organization_id: 2,
            status: "active",
            applications_count: 8,
            created_at: "2024-02-20T14:15:00Z"
          },
          {
            id: 3,
            title: "Senior Center Visitor",
            description: "Spend time with seniors at our local senior center, playing games and providing companionship.",
            skills_required: "Patience, Communication",
            start_date: "2024-06-15T00:00:00Z",
            end_date: "2024-07-15T00:00:00Z",
            location: "Golden Years Senior Center, 789 Oak St",
            organization_name: "Elder Care",
            organization_id: 3,
            status: "draft",
            applications_count: 2,
            created_at: "2024-03-10T09:45:00Z"
          },
          {
            id: 4,
            title: "Animal Shelter Volunteer",
            description: "Help care for animals at the local shelter, including feeding, cleaning, and socialization.",
            skills_required: "Animal care, Physical activity",
            start_date: "2024-07-01T00:00:00Z",
            end_date: "2024-09-30T00:00:00Z",
            location: "City Animal Shelter, 321 Pet Lane",
            organization_name: "Animal Rescue League",
            organization_id: 4,
            status: "active",
            applications_count: 12,
            created_at: "2024-01-05T16:20:00Z"
          },
          {
            id: 5,
            title: "Youth Mentorship Program",
            description: "Mentor young people in educational and life skills development.",
            skills_required: "Teaching, Mentoring, Communication",
            start_date: "2024-08-01T00:00:00Z",
            end_date: "2024-12-15T00:00:00Z",
            location: "Youth Center, 654 Hope Street",
            organization_name: "Youth Development",
            organization_id: 5,
            status: "closed",
            applications_count: 3,
            created_at: "2024-04-12T11:30:00Z"
          }
        ];
        
        setOpportunities(mockOpportunities);
        console.log("Using mock data for development");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropdownOpen !== null) {
        setIsDropdownOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Make sure opportunities is an array before filtering
  const filteredOpportunities = Array.isArray(opportunities) 
    ? opportunities.filter(
        (opp) =>
          opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const showToastNotification = (title: string, description: string, variant: string) => {
    setToastMessage({ title, description, variant });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity({ ...opportunity });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveOpportunity = async () => {
    if (!selectedOpportunity) return;
    
    try {
      setUpdating(selectedOpportunity.id);
      
      // Use opportunitiesAPI.update for editing existing opportunities
      await opportunitiesAPI.update(selectedOpportunity.id, selectedOpportunity);
      
      setOpportunities(
        opportunities.map((opp) =>
          opp.id === selectedOpportunity.id ? selectedOpportunity : opp
        )
      );
      
      setIsEditDialogOpen(false);
      showToastNotification('Success', 'Opportunity updated successfully', 'success');
    } catch (err: any) {
      console.error("Failed to update opportunity:", err);
      showToastNotification('Error', 'Failed to update opportunity', 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedOpportunity) return;
    
    try {
      setUpdating(selectedOpportunity.id);
      
      // 🎯 Use adminAPI.deleteOpportunity() for admin deletion
      await adminAPI.deleteOpportunity(selectedOpportunity.id);
      
      setOpportunities(
        opportunities.filter((opp) => opp.id !== selectedOpportunity.id)
      );
      
      setIsDeleteDialogOpen(false);
      showToastNotification('Success', 'Opportunity deleted successfully', 'success');
    } catch (err: any) {
      console.error("Failed to delete opportunity:", err);
      showToastNotification('Error', 'Failed to delete opportunity', 'destructive');
    } finally {
      setUpdating(null);
      setSelectedOpportunity(null);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };

  const handleStatusChange = async (opportunityId: number, newStatus: string) => {
    try {
      setUpdating(opportunityId);
      
      const opportunityToUpdate = opportunities.find(opp => opp.id === opportunityId);
      if (!opportunityToUpdate) return;

      const updatedOpportunity = { ...opportunityToUpdate, status: newStatus };
      
      // Use opportunitiesAPI.update to change status
      await opportunitiesAPI.update(opportunityId, updatedOpportunity);
      
      setOpportunities(
        opportunities.map((opp) =>
          opp.id === opportunityId ? { ...opp, status: newStatus } : opp
        )
      );
      
      setIsDropdownOpen(null);
      showToastNotification('Success', `Opportunity ${newStatus} successfully`, 'success');
    } catch (err: any) {
      console.error(`Failed to update opportunity status to ${newStatus}:`, err);
      showToastNotification('Error', `Failed to ${newStatus} opportunity`, 'destructive');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Opportunity Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error && opportunities.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Opportunity Management</h1>
        <div className="text-red-500 p-4 bg-red-50 border border-red-200 rounded">
          <p className="font-medium">Error loading opportunities</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Opportunity Management</h1>
          <p className="text-gray-600">Manage all volunteer opportunities across organizations</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500 self-center">
            {filteredOpportunities.length} of {opportunities.length} opportunities
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
                        <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.257 3.099c.366-.446.98-.446 1.346 0l7.071 8.571c.344.417.051 1.033-.424 1.033H2.606c-.475 0-.768-.616-.424-1.033l7.075-8.571zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v2a1 1 0 01-1 1z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredOpportunities.map((opp) => (
          <div key={opp.id} className="border border-gray-200 rounded-lg p-6 shadow-sm relative bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{opp.title}</h2>
                <p className="text-gray-600">{opp.organization_name}</p>
                <p className="text-sm text-gray-500">{formatDate(opp.start_date)} – {formatDate(opp.end_date)}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getStatusStyle(opp.status)}`}>
                  {opp.status}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(e, opp.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ⋮
                </button>
                {isDropdownOpen === opp.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleEditOpportunity(opp)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleDeleteOpportunity(opp)}
                    >
                      Delete
                    </button>
                    {opp.status !== "active" && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleStatusChange(opp.id, "active")}
                      >
                        Set Active
                      </button>
                    )}
                    {opp.status !== "draft" && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleStatusChange(opp.id, "draft")}
                      >
                        Set Draft
                      </button>
                    )}
                    {opp.status !== "closed" && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleStatusChange(opp.id, "closed")}
                      >
                        Set Closed
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="mt-4 text-gray-700">{opp.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Skills Required: {opp.skills_required}
            </p>
            <p className="text-sm text-gray-500">
              Location: {opp.location}
            </p>
            <p className="text-sm text-gray-500">
              Applications: {opp.applications_count}
            </p>
          </div>
        ))}
      </div>

      {/* Edit and Delete Modals would go here (optional depending on your component structure) */}
    </div>
  );
}
