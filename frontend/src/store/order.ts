import { defineStore } from 'pinia';
import { orderApi } from '../api';
import type { Order, OrderRequest } from '../types';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    getOrderById: (state) => (id: number) => {
      return state.orders.find(order => order.id === id);
    }
  },
  actions: {
    // 获取订单列表
    async fetchOrders(params?: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderApi.getOrders(params);
        this.orders = response.data;
      } catch (error) {
        this.error = '获取订单列表失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 创建订单
    async createOrder(orderData: OrderRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderApi.createOrder(orderData);
        this.orders.push(response.data);
        return response.data;
      } catch (error) {
        this.error = '创建订单失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 获取订单详情
    async fetchOrderById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderApi.getOrderById(id);
        this.currentOrder = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取订单详情失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 更新订单
    async updateOrder(id: number, orderData: OrderRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderApi.updateOrder(id, orderData);
        const index = this.orders.findIndex(order => order.id === id);
        if (index !== -1) {
          this.orders[index] = response.data;
        }
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = '更新订单失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 删除订单
    async deleteOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await orderApi.deleteOrder(id);
        this.orders = this.orders.filter(order => order.id !== id);
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = null;
        }
      } catch (error) {
        this.error = '删除订单失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});