'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { opportunitiesAPI, matchesAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Award, 
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  skills_required: string;
  start_date: string;
  end_date: string;
  location: string;
  organization_id: number;
  organization?: {
    id: number;
    name: string;
    description: string;
    contact_email: string;
  };
  applications_count?: number;
  status?: string;
}

export default function OpportunityDetail({ params }: { params: { id: string } }) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await opportunitiesAPI.getById(parseInt(params.id));
        setOpportunity(response.data);
        
        // Check if user has already applied (if logged in as volunteer)
        if (isAuthenticated && user?.role === 'volunteer') {
          await checkApplicationStatus();
        }
      } catch (error: any) {
        console.error('Error fetching opportunity:', error);
        setError(error.response?.data?.message || 'Failed to load opportunity details');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [params.id, isAuthenticated, user]);

  const checkApplicationStatus = async () => {
    try {
      const response = await matchesAPI.getAll();
      const userApplications = response.data;
      const hasAppliedToThis = userApplications.some(
        (app: any) => app.opportunity_id === parseInt(params.id)
      );
      setHasApplied(hasAppliedToThis);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  // 🎯 MAIN IMPLEMENTATION: Apply to opportunity
  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user?.role !== 'volunteer') {
      showToastNotification('Only volunteers can apply for opportunities', 'error');
      return;
    }

    if (hasApplied) {
      showToastNotification('You have already applied to this opportunity', 'error');
      return;
    }

    try {
      setApplying(true);
      
      // 🚀 USE matchesAPI.apply() method
      await matchesAPI.apply(parseInt(params.id));
      
      setHasApplied(true);
      showToastNotification('Application submitted successfully! The organization will review your application.', 'success');
      
      // Update applications count locally
      if (opportunity) {
        setOpportunity({
          ...opportunity,
          applications_count: (opportunity.applications_count || 0) + 1
        });
      }
      
    } catch (error: any) {
      console.error('Error applying:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to submit application. Please try again.';
      showToastNotification(errorMessage, 'error');
    } finally {
      setApplying(false);
    }
  };

  const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSkills = (skills: string) => {
    return skills.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Opportunity</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/opportunities')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Opportunities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border ${
          toastType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toastType === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Opportunities
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
                {opportunity.organization && (
                  <p className="text-blue-100 text-lg">
                    by {opportunity.organization.name}
                  </p>
                )}
              </div>
              
              {/* Apply Button */}
              {isAuthenticated && user?.role === 'volunteer' && (
                <div className="mt-4 md:mt-0">
                  {hasApplied ? (
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Applied Successfully
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {applying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Applying...
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Sign In Prompt for Non-Authenticated Users */}
              {!isAuthenticated && (
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Sign In to Apply
                  </button>
                </div>
              )}

              {/* Organization Users Cannot Apply */}
              {isAuthenticated && user?.role === 'organization' && (
                <div className="mt-4 md:mt-0">
                  <div className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center opacity-75">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Organizations cannot apply
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Opportunity</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {opportunity.description}
                  </div>
                </div>

                {/* Skills Required */}
                {opportunity.skills_required && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {formatSkills(opportunity.skills_required).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Instructions */}
                {isAuthenticated && user?.role === 'volunteer' && !hasApplied && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to Apply?</h3>
                    <p className="text-blue-800 mb-4">
                      Click the "Apply Now" button to submit your application. The organization will review your profile and get back to you.
                    </p>
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {applying ? 'Submitting Application...' : 'Apply Now'}
                    </button>
                  </div>
                )}

                {/* Already Applied Message */}
                {hasApplied && (
                  <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-2">Application Submitted</h3>
                    <p className="text-green-800 mb-4">
                      Your application has been submitted successfully. The organization will review your profile and get back to you.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Opportunity Details</h3>
                  
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{opportunity.location}</p>
                      </div>
                    </div>

                    {/* Start Date */}
                    {opportunity.start_date && (
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Start Date</p>
                          <p className="text-sm text-gray-600">{formatDate(opportunity.start_date)}</p>
                        </div>
                      </div>
                    )}

                    {/* End Date */}
                    {opportunity.end_date && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">End Date</p>
                          <p className="text-sm text-gray-600">{formatDate(opportunity.end_date)}</p>
                        </div>
                      </div>
                    )}

                    {/* Applications Count */}
                    {opportunity.applications_count !== undefined && (
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Applications</p>
                          <p className="text-sm text-gray-600">{opportunity.applications_count} people applied</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organization Info */}
                  {opportunity.organization && (
                    <div className="border-t pt-6">
                      <h4 className="text-md font-bold text-gray-900 mb-3">About the Organization</h4>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">{opportunity.organization.name}</p>
                        {opportunity.organization.description && (
                          <p className="text-sm text-gray-600">{opportunity.organization.description}</p>
                        )}
                        <p className="text-sm text-gray-500">{opportunity.organization.contact_email}</p>
                      </div>
                    </div>
                  )}

                  {/* Call to Action for Non-Volunteers */}
                  {!isAuthenticated && (
                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-600 mb-3">
                        Want to apply for this opportunity?
                      </p>
                      <button
                        onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                      >
                        Sign In to Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}