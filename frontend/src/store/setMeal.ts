import { defineStore } from 'pinia';
import { setMealApi } from '../api';
import type { SetMeal, SetMealRequest } from '../types';

export const useSetMealStore = defineStore('setMeal', {
  state: () => ({
    setMeals: [] as SetMeal[],
    currentSetMeal: null as SetMeal | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    getSetMealById: (state) => (id: number) => {
      return state.setMeals.find(setMeal => setMeal.id === id);
    }
  },
  actions: {
    // 获取套餐列表
    async fetchSetMeals() {
      this.loading = true;
      this.error = null;
      try {
        const response = await setMealApi.getSetMeals();
        this.setMeals = response.data;
      } catch (error) {
        this.error = '获取套餐列表失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 创建套餐
    async createSetMeal(setMealData: SetMealRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await setMealApi.createSetMeal(setMealData);
        this.setMeals.push(response.data);
        return response.data;
      } catch (error) {
        this.error = '创建套餐失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 获取套餐详情
    async fetchSetMealById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await setMealApi.getSetMealById(id);
        this.currentSetMeal = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取套餐详情失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 更新套餐
    async updateSetMeal(id: number, setMealData: SetMealRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await setMealApi.updateSetMeal(id, setMealData);
        const index = this.setMeals.findIndex(setMeal => setMeal.id === id);
        if (index !== -1) {
          this.setMeals[index] = response.data;
        }
        if (this.currentSetMeal && this.currentSetMeal.id === id) {
          this.currentSetMeal = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = '更新套餐失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 删除套餐
    async deleteSetMeal(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await setMealApi.deleteSetMeal(id);
        this.setMeals = this.setMeals.filter(setMeal => setMeal.id !== id);
        if (this.currentSetMeal && this.currentSetMeal.id === id) {
          this.currentSetMeal = null;
        }
      } catch (error) {
        this.error = '删除套餐失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
