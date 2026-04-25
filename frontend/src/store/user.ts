import { defineStore } from 'pinia';
import api from '../api';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as any[],
    currentUser: null as any,
    loading: false,
    error: null as string | null
  }),
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(user => user.id === id);
    }
  },
  actions: {
    // 获取用户列表
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/users');
        this.users = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || '获取用户列表失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取用户详情
    async fetchUserById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/users/${id}`);
        this.currentUser = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || '获取用户详情失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 创建用户
    async createUser(userData: {
      username: string;
      password: string;
      role: string;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/users', userData);
        this.users.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || '创建用户失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 更新用户
    async updateUser(id: number, userData: {
      username?: string;
      password?: string;
      role?: string;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/users/${id}`, userData);
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = response.data;
        }
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || '更新用户失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 删除用户
    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter(user => user.id !== id);
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = null;
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || '删除用户失败';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});