"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Building,
  Users,
  FileText,
  Camera,
  Lock,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Define the form schema types
interface ProfileFormValues {
  name: string;
  description: string;
  mission: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  year_founded: string;
  size: string;
  categories: string;
}

interface SecurityFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface NotificationFormValues {
  email_applications: boolean;
  email_messages: boolean;
  email_hour_submissions: boolean;
  email_platform_updates: boolean;
}

export default function OrganizationProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" });

  // Form states
  const [profileForm, setProfileForm] = useState<ProfileFormValues>({
    name: "",
    description: "",
    mission: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    year_founded: "",
    size: "",
    categories: "",
  });

  const [securityForm, setSecurityForm] = useState<SecurityFormValues>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [notificationForm, setNotificationForm] = useState<NotificationFormValues>({
    email_applications: true,
    email_messages: true,
    email_hour_submissions: true,
    email_platform_updates: false,
  });

  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      try {
        setLoading(true);

        // In a real implementation, fetch from your API
        // const response = await fetch('/api/organization/profile');
        // const data = await response.json();

        // Placeholder data for demonstration
        const data = {
          name: "Community Helpers Foundation",
          description:
            "A non-profit organization dedicated to improving local communities through volunteer work and community engagement initiatives.",
          mission:
            "To empower communities by connecting passionate volunteers with meaningful opportunities that create lasting positive change.",
          website: "https://communityhelpers.org",
          email: "info@communityhelpers.org",
          phone: "(555) 123-4567",
          address: "123 Main Street, Suite 200",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          year_founded: "2010",
          size: "10-50",
          categories: "Community Development, Education, Environment",
          avatar: null,
          notification_settings: {
            email_applications: true,
            email_messages: true,
            email_hour_submissions: true,
            email_platform_updates: false,
          },
        };

        // Set form values
        setProfileForm({
          name: data.name,
          description: data.description,
          mission: data.mission,
          website: data.website,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          year_founded: data.year_founded,
          size: data.size,
          categories: data.categories,
        });

        // Set notification form values
        setNotificationForm(data.notification_settings);

        // Set avatar if available
        if (data.avatar) {
          setAvatarSrc(data.avatar);
        }
      } catch (error) {
        console.error("Error fetching organization profile:", error);
        showToastNotification("Error", "Failed to load organization profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationProfile();
  }, []);

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};
    
    if (!profileForm.name || profileForm.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!profileForm.description || profileForm.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }
    
    if (!profileForm.mission || profileForm.mission.length < 20) {
      errors.mission = "Mission statement must be at least 20 characters";
    }
    
    if (profileForm.website && !/^https?:\/\/.*/.test(profileForm.website)) {
      errors.website = "Please enter a valid URL";
    }
    
    if (!profileForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (profileForm.phone && profileForm.phone.length < 10) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!profileForm.city || profileForm.city.length < 2) {
      errors.city = "City must be at least 2 characters";
    }
    
    if (!profileForm.state || profileForm.state.length < 2) {
      errors.state = "State must be at least 2 characters";
    }
    
    if (!profileForm.zip || profileForm.zip.length < 5) {
      errors.zip = "ZIP code must be at least 5 characters";
    }
    
    if (profileForm.year_founded && isNaN(Number(profileForm.year_founded))) {
      errors.year_founded = "Year founded must be a number";
    }
    
    if (!profileForm.categories || profileForm.categories.length < 3) {
      errors.categories = "Categories must be at least 3 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSecurityForm = () => {
    const errors: Record<string, string> = {};
    
    if (!securityForm.current_password) {
      errors.current_password = "Current password is required";
    }
    
    if (!securityForm.new_password || securityForm.new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters";
    }
    
    if (!securityForm.confirm_password || securityForm.confirm_password.length < 8) {
      errors.confirm_password = "Password must be at least 8 characters";
    }
    
    if (securityForm.new_password !== securityForm.confirm_password) {
      errors.confirm_password = "Passwords don't match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const onProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setSaving(true);

      // In a real implementation, send to your API
      // await fetch('/api/organization/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileForm),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToastNotification("Success", "Organization profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating organization profile:", error);
      showToastNotification("Error", "Failed to update organization profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const onSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSecurityForm()) {
      return;
    }
    
    try {
      setSaving(true);

      // In a real implementation, send to your API
      // await fetch('/api/organization/security', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(securityForm),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToastNotification("Success", "Password updated successfully", "success");

      // Reset form
      setSecurityForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      showToastNotification("Error", "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  const onNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      // In a real implementation, send to your API
      // await fetch('/api/organization/notifications', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(notificationForm),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToastNotification("Success", "Notification settings updated successfully", "success");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      showToastNotification("Error", "Failed to update notification settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // In a real implementation, you would upload the file to your server
      showToastNotification("Avatar updated", "Your organization avatar has been updated", "success");
    }
  };

  const showToastNotification = (title: string, message: string, type: string) => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Organization Profile</h1>
        <p className="text-gray-500">
          Manage your organization's profile and account settings
        </p>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          toastMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 
          toastMessage.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toastMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                toastMessage.type === 'success' ? 'text-green-800' : 
                toastMessage.type === 'error' ? 'text-red-800' : 'text-blue-800'
              }`}>
                {toastMessage.title}
              </h3>
              <div className={`mt-1 text-sm ${
                toastMessage.type === 'success' ? 'text-green-700' : 
                toastMessage.type === 'error' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {toastMessage.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                              activeTab === "notifications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Notifications
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Organization Avatar */}
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Organization Avatar</h2>
              <p className="text-sm text-gray-500 mt-1">
                Upload your organization's logo or profile image
              </p>
            </div>
            <div className="p-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-medium overflow-hidden">
                {avatarSrc ? (
                  <Image 
                    src={avatarSrc} 
                    alt="Organization avatar"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profileForm.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    Upload a new avatar
                  </p>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                      <Camera className="h-4 w-4" />
                      <span>Choose file</span>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 200x200 pixels, less than
                  5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Organization Information</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your organization's basic information
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={onProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter organization name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter phone number"
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
                    type="text"
                    id="website"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="https://yourorganization.org"
                  />
                  {formErrors.website && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.website}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Organization Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={profileForm.description}
                    onChange={handleProfileChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Describe your organization"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This will be displayed on your public profile.
                  </p>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="mission" className="block text-sm font-medium text-gray-700">
                    Mission Statement
                  </label>
                  <textarea
                    id="mission"
                    name="mission"
                    value={profileForm.mission}
                    onChange={handleProfileChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Your organization's mission"
                  />
                  {formErrors.mission && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.mission}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <input
                    type="text"
                    id="categories"
                    name="categories"
                    value={profileForm.categories}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="e.g. Education, Environment, Health"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Comma-separated list of categories that describe your organization
                  </p>
                  {formErrors.categories && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.categories}</p>
                  )}
                </div>

                <h3 className="text-lg font-medium pt-2">Location Information</h3>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter street address"
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
                      type="text"
                      id="city"
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter city"
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
                      type="text"
                      id="state"
                      name="state"
                      value={profileForm.state}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter state"
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={profileForm.zip}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter ZIP code"
                    />
                    {formErrors.zip && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.zip}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="year_founded" className="block text-sm font-medium text-gray-700">
                      Year Founded
                    </label>
                    <input
                      type="text"
                      id="year_founded"
                      name="year_founded"
                      value={profileForm.year_founded}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="e.g. 2010"
                    />
                    {formErrors.year_founded && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.year_founded}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                      Organization Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={profileForm.size}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="e.g. 10-50 employees"
                    />
                    {formErrors.size && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    saving ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <p className="text-sm text-gray-500 mt-1">Update your account password</p>
            </div>
            <div className="p-6">
              <form onSubmit={onSecuritySubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={securityForm.current_password}
                    onChange={handleSecurityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter current password"
                  />
                  {formErrors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.current_password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={securityForm.new_password}
                    onChange={handleSecurityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long.
                  </p>
                  {formErrors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.new_password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={securityForm.confirm_password}
                    onChange={handleSecurityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Confirm new password"
                  />
                  {formErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirm_password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    saving ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Account Security</h2>
              <p className="text-sm text-gray-500 mt-1">
                Additional security options for your account
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  disabled
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 opacity-60 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Login History</h4>
                  <p className="text-sm text-gray-500">
                    View your recent login activity
                  </p>
                </div>
                <button
                  disabled
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 opacity-60 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Email Notifications</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage which emails you receive from Versity
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={onNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="checkbox"
                      id="email_applications"
                      name="email_applications"
                      checked={notificationForm.email_applications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="email_applications" className="font-medium text-sm">
                        Volunteer Applications
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails when volunteers apply to your opportunities
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="checkbox"
                      id="email_messages"
                      name="email_messages"
                      checked={notificationForm.email_messages}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="email_messages" className="font-medium text-sm">
                        Messages
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails when you get new messages from volunteers
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="checkbox"
                      id="email_hour_submissions"
                      name="email_hour_submissions"
                      checked={notificationForm.email_hour_submissions}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="email_hour_submissions" className="font-medium text-sm">
                        Hour Submissions
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails when volunteers submit hours for verification
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <input
                      type="checkbox"
                      id="email_platform_updates"
                      name="email_platform_updates"
                      checked={notificationForm.email_platform_updates}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="email_platform_updates" className="font-medium text-sm">
                        Platform Updates
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive emails about new features and updates to the Versity platform
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    saving ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


