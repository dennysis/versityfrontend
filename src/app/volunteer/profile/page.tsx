'use client';

import { useState, useEffect } from 'react';
import { authAPI, volunteersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, FileText, Calendar, MapPin, Phone, Edit3, Save, X } from 'lucide-react';

interface VolunteerProfile {
  id: number;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  availability?: string;
  emergency_contact?: string;
  date_of_birth?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  user_type?: string;
}

interface FormData {
  name: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  skills: string[];
  availability: string;
  emergency_contact: string;
  date_of_birth: string;
  avatar: string;
}

export default function VolunteerProfile() {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    skills: [],
    availability: '',
    emergency_contact: '',
    date_of_birth: '',
    avatar: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        // Try to get current user profile first
        let profileData;
        try {
          const response = await authAPI.getCurrentUser();
          profileData = response.data;
        } catch (authError) {
          // If auth API fails, try volunteers API
          console.log('Auth API failed, trying volunteers API...');
          const response = await volunteersAPI.getProfile(user.id);
          profileData = response.data;
        }
        
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          skills: Array.isArray(profileData.skills) ? profileData.skills : [],
          availability: profileData.availability || '',
          emergency_contact: profileData.emergency_contact || '',
          date_of_birth: profileData.date_of_birth ? profileData.date_of_birth.split('T')[0] : '',
          avatar: profileData.avatar || ''
        });
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const updateData = {
        ...formData,
        date_of_birth: formData.date_of_birth || null
      };

      // Try to update using auth API first
      let updatedProfile;
      try {
        await authAPI.updateProfile(updateData);
        const response = await authAPI.getCurrentUser();
        updatedProfile = response.data;
      } catch (authError) {
        // If auth API fails, try volunteers API
        console.log('Auth update failed, trying volunteers API...');
        await volunteersAPI.updateProfile(user.id, updateData);
        const response = await volunteersAPI.getProfile(user.id);
        updatedProfile = response.data;
      }
      
      // Update local state
      setProfile(updatedProfile);
      setEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        availability: profile.availability || '',
        emergency_contact: profile.emergency_contact || '',
        date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
        avatar: profile.avatar || '',
      });
    }
    setEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Profile</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
            <button 
              onClick={() => setError(null)} 
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              

<div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
  {profile?.avatar ? (
    <img 
      src={profile.avatar} 
      alt={profile?.name || 'User avatar'}
      className="h-full w-full rounded-full object-cover"
      onError={(e) => {
        console.error('Avatar failed to load:', profile.avatar);
        // Hide the image and show initials instead
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) {
          parent.innerHTML = profile?.name?.substring(0, 2).toUpperCase() || 'V';
          parent.className = parent.className.replace('overflow-hidden', '');
        }
      }}
      onLoad={() => {
        console.log('Avatar loaded successfully:', profile.avatar);
      }}
    />
  ) : (
    <span className="text-white">
      {profile?.name?.substring(0, 2).toUpperCase() || 'V'}
    </span>
  )}
</div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {profile?.name || 'Volunteer'}
                </h1>
                <p className="text-blue-100">{profile?.email}</p>
                <p className="text-blue-100 text-sm">
                  Member since {formatDate(profile?.created_at || '')}
                </p>
              </div>
            </div>
            <button
              onClick={() => editing ? handleCancel() : setEditing(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Profile Content */}
        <div className="p-6">
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    name="avatar"
                    type="url"
                    value={formData.avatar || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a URL to your profile picture
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date of Birth
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name and phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about about yourself, your interests, and why you want to volunteer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills & Interests
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill or interest"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 letterspacing-wide">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{profile?.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{profile?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{profile?.location || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Personal Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Born: {profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Availability: {profile?.availability || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {profile?.emergency_contact && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Emergency Contact</h3>
                      <p className="text-gray-900">{profile.emergency_contact}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Skills & Interests</h3>
                    {profile?.skills && Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No skills added yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Profile Completion</h3>
                    <div className="space-y-2">
                      {(() => {
                        const fields = [
                          { name: 'Name', value: profile?.name },
                          { name: 'Email', value: profile?.email },
                          { name: 'Bio', value: profile?.bio },
                          { name: 'Phone', value: profile?.phone },
                          { name: 'Location', value: profile?.location },
                          { name: 'Skills', value: profile?.skills?.length },
                        ];
                        const completed = fields.filter(field => field.value).length;
                        const percentage = Math.round((completed / fields.length) * 100);
                        
                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span>Profile Completion</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            {percentage < 100 && (
                              <p className="text-sm text-gray-600">
                                Complete your profile to improve your volunteer opportunities!
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {profile?.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">About Me</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-line leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              )}

              {!profile?.bio && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-2">Complete Your Profile</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Add a bio and more details to help organizations understand your interests and skills.
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              <div className="pt-6 border-t">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/volunteer/opportunities"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-medium">Find Opportunities</h3>
              <p className="text-sm text-gray-600">Discover new volunteer opportunities</p>
            </div>
          </a>
          
          <a
            href="/volunteer/applications"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-medium">My Applications</h3>
              <p className="text-sm text-gray-600">Track your applications</p>
            </div>
          </a>
          
          <a
            href="/volunteer/hours"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⏰</div>
              <h3 className="font-medium">Log Hours</h3>
              <p className="text-sm text-gray-600">Record your volunteer time</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

