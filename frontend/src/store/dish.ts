import { defineStore } from 'pinia';
import { dishApi } from '../api';
import type { Dish, DishRequest } from '../types';

export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [] as Dish[],
    currentDish: null as Dish | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    getDishById: (state) => (id: number) => {
      return state.dishes.find(dish => dish.id === id);
    },
    getDishesByCategory: (state) => (category: string) => {
      return state.dishes.filter(dish => dish.category === category);
    }
  },
  actions: {
    // 获取菜品列表
    async fetchDishes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await dishApi.getDishes();
        this.dishes = response.data;
      } catch (error) {
        this.error = '获取菜品列表失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 创建菜品
    async createDish(dishData: DishRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await dishApi.createDish(dishData);
        this.dishes.push(response.data);
        return response.data;
      } catch (error) {
        this.error = '创建菜品失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 获取菜品详情
    async fetchDishById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await dishApi.getDishById(id);
        this.currentDish = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取菜品详情失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 更新菜品
    async updateDish(id: number, dishData: DishRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await dishApi.updateDish(id, dishData);
        const index = this.dishes.findIndex(dish => dish.id === id);
        if (index !== -1) {
          this.dishes[index] = response.data;
        }
        if (this.currentDish && this.currentDish.id === id) {
          this.currentDish = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = '更新菜品失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 删除菜品
    async deleteDish(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await dishApi.deleteDish(id);
        this.dishes = this.dishes.filter(dish => dish.id !== id);
        if (this.currentDish && this.currentDish.id === id) {
          this.currentDish = null;
        }
      } catch (error) {
        this.error = '删除菜品失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});