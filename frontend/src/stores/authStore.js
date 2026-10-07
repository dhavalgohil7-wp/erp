import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('erp_user') || 'null'),
  token: localStorage.getItem('erp_token') || null,
  currentInstitute: JSON.parse(localStorage.getItem('erp_institute') || 'null'),
  currentBranch: JSON.parse(localStorage.getItem('erp_branch') || 'null'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, current_institute, current_branch } = response.data.data;

      localStorage.setItem('erp_token', token);
      localStorage.setItem('erp_user', JSON.stringify(user));
      localStorage.setItem('erp_institute', JSON.stringify(current_institute));
      localStorage.setItem('erp_branch', JSON.stringify(current_branch));

      set({
        token,
        user,
        currentInstitute: current_institute,
        currentBranch: current_branch,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication failed. Please check credentials.';
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      localStorage.removeItem('erp_institute');
      localStorage.removeItem('erp_branch');
      set({ user: null, token: null, currentInstitute: null, currentBranch: null });
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data;
      localStorage.setItem('erp_user', JSON.stringify(user));
      set({ user });
    } catch (e) {
      // Handled by 401 interceptor
    }
  },

  setBranch: (branch) => {
    localStorage.setItem('erp_branch', JSON.stringify(branch));
    set({ currentBranch: branch });
  },

  hasPermission: (permissionName) => {
    const user = get().user;
    if (!user) return false;
    if (user.roles?.includes('super_admin')) return true;
    return user.permissions?.includes(permissionName) || false;
  },

  hasRole: (roleName) => {
    const user = get().user;
    if (!user) return false;
    return user.roles?.includes(roleName) || false;
  },
}));
