import { defineStore } from 'pinia';
import { statsApi } from '../api';
import type { IngredientStat, OrderStat } from '../types';

export const useStatsStore = defineStore('stats', {
  state: () => ({
    ingredientStats: [] as IngredientStat[],
    orderStats: null as OrderStat | null,
    loading: false,
    error: null as string | null
  }),
  actions: {
    // 获取食材统计
    async fetchIngredientStats(start_date?: string, end_date?: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await statsApi.getIngredientStats(start_date, end_date);
        this.ingredientStats = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取食材统计失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 获取订单统计
    async fetchOrderStats(start_date?: string, end_date?: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await statsApi.getOrderStats(start_date, end_date);
        this.orderStats = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取订单统计失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});