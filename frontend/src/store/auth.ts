import { defineStore } from 'pinia';
import api from '../api';

const TOKEN_EXPIRY_KEY = 'token_expiry';
const DEFAULT_EXPIRY_HOURS = 24;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as {
      id: number;
      username: string;
      role: string;
    } | null,
    token: localStorage.getItem('token') || null,
    tokenExpiry: localStorage.getItem(TOKEN_EXPIRY_KEY) ? parseInt(localStorage.getItem(TOKEN_EXPIRY_KEY)!) : null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !state.isTokenExpired,
    isTokenExpired: (state) => {
      if (!state.tokenExpiry) return false;
      return Date.now() > state.tokenExpiry;
    },
    currentUser: (state) => state.user
  },
  actions: {
    setTokenExpiry() {
      const expiryTime = Date.now() + DEFAULT_EXPIRY_HOURS * 60 * 60 * 1000;
      this.tokenExpiry = expiryTime;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    },

    clearTokenExpiry() {
      this.tokenExpiry = null;
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    },

    checkAndClearExpiredToken() {
      if (this.isTokenExpired) {
        this.logout();
        return true;
      }
      return false;
    },

    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', {
          username,
          password
        });
        
        const { token, user } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        this.setTokenExpiry();

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return user;
      } catch (error: any) {
        this.error = error.response?.data?.error || '登录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    


    logout() {
      this.token = null;
      this.user = null;
      this.clearTokenExpiry();
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
    


    async register(username: string, password: string, role: string = 'user') {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', {
          username,
          password,
          role
        });
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || '注册失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    


    async getCurrentUser() {
      if (!this.token) return null;
      
      if (this.checkAndClearExpiredToken()) {
        return null;
      }
      
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.user;
        return response.data.user;
      } catch (error: any) {
        this.error = error.response?.data?.error || '获取用户信息失败';
        if (error.response?.status === 401) {
          this.logout();
        }
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});