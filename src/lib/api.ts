import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://versity-bck.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await api.post('/auth/refresh-token');
        const { access_token } = refreshResponse.data;
        
        localStorage.setItem('accessToken', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data), // NEW
  updateUser: (id: number, data: any) => api.put(`/auth/users/${id}`, data), // NEW
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, new_password: newPassword }),
  logout: () => api.post('/auth/logout')
};

// Opportunities API
export const opportunitiesAPI = {
  getAll: (params?: any) => api.get('/opportunities', { params }),
  getById: (id: number) => api.get(`/opportunities/${id}`),
  create: (data: any) => api.post('/opportunities', data),
  update: (id: number, data: any) => api.put(`/opportunities/${id}`, data),
  delete: (id: number) => api.delete(`/opportunities/${id}`), // NEW
  getApplications: (id: number) => api.get(`/opportunities/${id}/applications`) // NEW
};

// Matches (Applications) API
export const matchesAPI = {
  getAll: () => api.get('/matches/'),
  apply: (opportunityId: number) => api.post('/matches/', { opportunity_id: opportunityId }),
  updateStatus: (id: number, status: string) => api.put(`/matches/${id}`, { status }),
getById:(id :number) => api.get(`/matches/${id}`), 
getByOpportunity: (opportunityId: number) => 
    api.get('/matches/', { params: { opportunity_id: opportunityId } }),
  getByVolunteer: (volunteerId: number) => 
    api.get('/matches/', { params: { volunteer_id: volunteerId } }),
  delete: (id: number) => api.delete(`/matches/${id}`)
};

// Volunteer Hours API - EXPANDED
export const hoursAPI = {
  getAll: (params?: any) => api.get('/volunteer-hours', { params }), // NEW
  getById: (id: number) => api.get(`/volunteer-hours/${id}`), // NEW
  log: (data: any) => api.post('/volunteer-hours', data),
  update: (id: number, data: any) => api.put(`/volunteer-hours/${id}`, data), // NEW
  delete: (id: number) => api.delete(`/volunteer-hours/${id}`), // NEW
  verify: (id: number, status: string) => api.put(`/volunteer-hours/${id}/verify`, { status }),
  getByVolunteer: (volunteerId: number) => api.get(`/volunteers/${volunteerId}/hours`) // NEW
};

export const organizationsAPI = {
  getAll: (params?: {
    skip?: number;
    limit?: number;
    name?: string;
    location?: string;
  }) => api.get('/organizations', { params }),
  getById: (id: number) => api.get(`/organizations/${id}`),
  create: (data: {
    name: string;
    description?: string;
    contact_email: string;
    location?: string;
  }) => api.post('/organizations', data),
  update: (id: number, data: {
    name?: string;
    description?: string;
    contact_email?: string;
    location?: string;
  }) => api.put(`/organizations/${id}`, data),
  delete: (id: number) => api.delete(`/organizations/${id}`),
  getOpportunities: (id: number, params?: any) => 
    api.get('/opportunities', { params: { ...params, organization_id: id } }),
  getVolunteers: (id: number) => api.get(`/organizations/${id}/volunteers`), // This might not exist
  getMatches: (id?: number) => api.get('/matches/', { params: id ? { organization_id: id } : {} }),
  getVolunteerHours: (params?: any) => api.get('/volunteer-hours', { params }),
  getDashboard: () => api.get('/admin/dashboard'),
    getCurrentUserOrganization: () => api.get('/organizations/me'),
};
// Volunteer API - EXPANDED
export const volunteersAPI = {
  getAll: () => api.get('/volunteers/'), // NEW
  getProfile: (id: number) => api.get(`/volunteers/${id}`),
    getProfileByAuth: () => api.get('/auth/me'), 
  updateProfile: (id: number, data: any) => api.put(`/volunteers/${id}`, data),
  getHours: (id: number) => api.get(`/volunteers/${id}/hours`),
  getStats: (id: number) => api.get(`/volunteers/${id}/stats`), // NEW
  getMatches: (id: number) => api.get(`/volunteers/${id}/matches`), // NEW
  create: (data: any) => api.post('/volunteers/', data), // NEW
  delete: (id: number) => api.delete(`/volunteers/${id}`) // NEW
};

// Admin API - EXPANDED
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getVolunteers: () => api.get('/admin/users/volunteers'), // NEW
  getOrganizationUsers: () => api.get('/admin/users/organizations'), // NEW
  getUser: (id: number) => api.get(`/admin/users/${id}`), // NEW
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  
  getOrganizations: () => api.get('/admin/organizations'),
  getOrganization: (id: number) => api.get(`/admin/organizations/${id}`),
  updateOrganization: (id: number, data: any) => api.put(`/admin/organizations/${id}`, data),
  deleteOrganization: (id: number) => api.delete(`/admin/organizations/${id}`),
  verifyOrganization: (id: number) => api.post(`/admin/organizations/${id}/verify`),
  updateOrganizationStatus: (id: number, status: string) => 
    api.put(`/admin/organizations/${id}/status`, { status }),
  getAllOpportunities: () => api.get('/admin/opportunities'), // NEW
  deleteOpportunity: (id: number) => api.delete(`/admin/opportunities/${id}`), // NEW
  
  getAllMatches: () => api.get('/admin/matches'), // NEW
  getAllHours: () => api.get('/admin/hours'), // NEW
  getAdmins: () => api.get('/admin/admins'), // NEW
  
  getAnalytics: () => api.get('/admin/analytics'),
  getDashboard: () => api.get('/admin/dashboard'),
  getDashboardStats: () => api.get('/admin/dashboard/stats'), // NEW
  getLogs: (params?: { limit?: number; offset?: number }) => 
    api.get('/admin/logs', { params })

};

// Health API - NEW
export const healthAPI = {
  check: () => api.get('/health/'),
  checkDatabase: () => api.get('/health/db')
};

export default api;
