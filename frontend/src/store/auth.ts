import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as {
      id: number;
      username: string;
      role: string;
    } | null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  actions: {
<<<<<<< HEAD
    // 登录
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
        
<<<<<<< HEAD
        // 设置 axios 默认请求头
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return user;
      } catch (error: any) {
        this.error = error.response?.data?.error || '登录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
<<<<<<< HEAD
    // 登出
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
    
<<<<<<< HEAD
    // 注册
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
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
    
<<<<<<< HEAD
    // 获取当前用户信息
=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
    async getCurrentUser() {
      if (!this.token) return;
      
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.user;
        return response.data.user;
      } catch (error: any) {
        this.error = error.response?.data?.error || '获取用户信息失败';
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});