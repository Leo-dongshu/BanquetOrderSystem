import { defineStore } from 'pinia';
import { calendarApi } from '../api';
import type { CalendarData } from '../types';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    calendarData: {} as CalendarData,
    loading: false,
    error: null as string | null
  }),
  actions: {
    // 获取订单日历数据
    async fetchOrderCalendar() {
      this.loading = true;
      this.error = null;
      try {
        const response = await calendarApi.getOrderCalendar();
        this.calendarData = response.data;
        return response.data;
      } catch (error) {
        this.error = '获取订单日历数据失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});