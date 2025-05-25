'use client';

import { useState, useEffect } from 'react';

interface ProfileFormValues {
  name: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export default function OrganizationSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormValues>({
    name: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    social_media: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' });

  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      try {
        setLoading(true);
        // In a real implementation, fetch from your API
        // const response = await fetch('/api/organization/profile');
        // const data = await response.json();
        
        // Placeholder data for demonstration
        const data = {
          name: 'Community Helpers Organization',
          description: 'We are dedicated to helping our local community through volunteer work and community service projects.',
          website: 'https://communityhelpers.org',
          phone: '555-123-4567',
          address: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
          email: 'info@communityhelpers.org',
          social_media: {
            facebook: 'https://facebook.com/communityhelpers',
            twitter: 'https://twitter.com/communityhelpers',
            instagram: 'https://instagram.com/communityhelpers',
            linkedin: 'https://linkedin.com/company/communityhelpers'
          }
        };
        
        // Set form data with fetched data
        setFormData(data);
      } catch (error) {
        console.error('Error fetching organization profile:', error);
        showToastNotification('Error', 'Failed to load organization profile', 'destructive');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationProfile();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.description || formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    if (!formData.address || formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }
    
    if (!formData.city || formData.city.length < 2) {
      errors.city = 'City must be at least 2 characters';
    }
    
    if (!formData.state || formData.state.length < 2) {
      errors.state = 'State must be at least 2 characters';
    }
    
    if (!formData.zip || formData.zip.length < 5) {
      errors.zip = 'Zip code must be at least 5 characters';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate social media URLs
    if (formData.social_media.facebook && !/^https?:\/\/.*/.test(formData.social_media.facebook)) {
      errors['social_media.facebook'] = 'Please enter a valid URL';
    }
    
    if (formData.social_media.twitter && !/^https?:\/\/.*/.test(formData.social_media.twitter)) {
      errors['social_media.twitter'] = 'Please enter a valid URL';
    }
    
    if (formData.social_media.instagram && !/^https?:\/\/.*/.test(formData.social_media.instagram)) {
      errors['social_media.instagram'] = 'Please enter a valid URL';
    }
    
    if (formData.social_media.linkedin && !/^https?:\/\/.*/.test(formData.social_media.linkedin)) {
      errors['social_media.linkedin'] = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_media.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real implementation, send to your API
      // await fetch('/api/organization/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToastNotification('Success', 'Organization profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating organization profile:', error);
      showToastNotification('Error', 'Failed to update organization profile', 'destructive');
    } finally {
      setSubmitting(false);
    }
  };

  const showToastNotification = (title: string, description: string, variant: string) => {
    setToastMessage({ title, description, variant });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-gray-500">
          Manage your organization profile and settings
        </p>
      </div>
      
      <div className="bg-white rounded-lg border shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Organization Profile</h2>
        </div>
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your organization"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border min-h-[120px]"
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              {formErrors.website && (
                <p className="mt-1 text-sm text-red-600">{formErrors.website}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              {formErrors.address && (
                <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                {formErrors.state && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                {formErrors.zip && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.zip}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="social_media.facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <input
                    id="social_media.facebook"
                    name="social_media.facebook"
                    type="text"
                    value={formData.social_media.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourpage"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  {formErrors['social_media.facebook'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['social_media.facebook']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="social_media.twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <input
                    id="social_media.twitter"
                    name="social_media.twitter"
                    type="text"
                    value={formData.social_media.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourhandle"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  {formErrors['social_media.twitter'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['social_media.twitter']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="social_media.instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <input
                    id="social_media.instagram"
                    name="social_media.instagram"
                    type="text"
                    value={formData.social_media.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourprofile"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  {formErrors['social_media.instagram'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['social_media.instagram']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="social_media.linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    id="social_media.linkedin"
                    name="social_media.linkedin"
                    type="text"
                    value={formData.social_media.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  {formErrors['social_media.linkedin'] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors['social_media.linkedin']}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

