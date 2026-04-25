import { defineStore } from 'pinia';
import { ingredientApi } from '../api';
import type { Ingredient, IngredientRequest } from '../types';

export const useIngredientStore = defineStore('ingredient', {
  state: () => ({
    ingredients: [] as Ingredient[],
    currentIngredient: null as Ingredient | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    getIngredientById: (state) => (id: number) => {
      return state.ingredients.find(ingredient => ingredient.id === id);
    }
  },
  actions: {
    // 获取配料列表
    async fetchIngredients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ingredientApi.getIngredients();
        this.ingredients = response.data;
      } catch (error) {
        this.error = '获取配料列表失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 创建配料
    async createIngredient(ingredientData: IngredientRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ingredientApi.createIngredient(ingredientData);
        this.ingredients.push(response.data);
        return response.data;
      } catch (error) {
        this.error = '创建配料失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 获取配料详情
    async fetchIngredientById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ingredientApi.getIngredientById(id);
        this.currentIngredient = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取配料详情失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 更新配料
    async updateIngredient(id: number, ingredientData: IngredientRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ingredientApi.updateIngredient(id, ingredientData);
        const index = this.ingredients.findIndex(ingredient => ingredient.id === id);
        if (index !== -1) {
          this.ingredients[index] = response.data;
        }
        if (this.currentIngredient && this.currentIngredient.id === id) {
          this.currentIngredient = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = '更新配料失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 删除配料
    async deleteIngredient(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await ingredientApi.deleteIngredient(id);
        this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
        if (this.currentIngredient && this.currentIngredient.id === id) {
          this.currentIngredient = null;
        }
      } catch (error) {
        this.error = '删除配料失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});