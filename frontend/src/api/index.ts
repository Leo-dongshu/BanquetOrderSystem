import axios from 'axios';
import type {
  Order,
  OrderRequest,
  Dish,
  DishRequest,
  Ingredient,
  IngredientRequest,
  IngredientStat,
  OrderStat,
  CalendarData,
  SetMeal,
  SetMealRequest
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const orderApi = {
  getOrders: (params?: any) => {
    if (typeof params === 'string') {
      return api.get<Order[]>(`/orders${params ? `?${params}` : ''}`);
    } else {
      return api.get<Order[]>('/orders', { params });
    }
  },
  createOrder: (data: OrderRequest) => api.post<Order>('/orders', data),
  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),
  updateOrder: (id: number, data: OrderRequest) => api.put<Order>(`/orders/${id}`, data),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
  getOrderDishes: (orderId: number) => api.get<any[]>(`/orders/${orderId}/dishes`),
  confirmPayment: (orderId: number, data: { payment_amount: number; discount_amount: number }) => 
    api.post<Order>(`/orders/${orderId}/payment`, data),
  getOrderStatuses: () => api.get<any[]>('/order-statuses')
};

export const dishApi = {
  getDishes: () => api.get<Dish[]>('/dishes'),
  createDish: (data: DishRequest) => api.post<Dish>('/dishes', data),
  getDishById: (id: number) => api.get<Dish>(`/dishes/${id}`),
  updateDish: (id: number, data: DishRequest) => api.put<Dish>(`/dishes/${id}`, data),
  deleteDish: (id: number) => api.delete(`/dishes/${id}`)
};

export const ingredientApi = {
  getIngredients: (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    return api.get<Ingredient[]>('/ingredients', { params });
  },
  createIngredient: (data: IngredientRequest) => api.post<Ingredient>('/ingredients', data),
  getIngredientById: (id: number) => api.get<Ingredient>(`/ingredients/${id}`),
  updateIngredient: (id: number, data: IngredientRequest) => api.put<Ingredient>(`/ingredients/${id}`, data),
  deleteIngredient: (id: number) => api.delete(`/ingredients/${id}`)
};

export const kitchenwareApi = {
  getKitchenwares: () => api.get<any[]>('/kitchenwares'),
  createKitchenware: (data: any) => api.post<any>('/kitchenwares', data),
  getKitchenwareById: (id: number) => api.get<any>(`/kitchenwares/${id}`),
  updateKitchenware: (id: number, data: any) => api.put<any>(`/kitchenwares/${id}`, data),
  deleteKitchenware: (id: number) => api.delete(`/kitchenwares/${id}`)
};

export const statsApi = {
  getIngredientStats: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return api.get<any[]>('/stats/ingredients', { params });
  },
  getOrderStats: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return api.get<any>('/stats/orders', { params });
  },
  getDashboardStats: () => api.get<any>('/stats/dashboard')
};

export const calendarApi = {
  getOrderCalendar: () => api.get<CalendarData>('/calendar/orders')
};

export const setMealApi = {
  getSetMeals: () => api.get<SetMeal[]>('/set-meals'),
  createSetMeal: (data: SetMealRequest) => api.post<SetMeal>('/set-meals', data),
  getSetMealById: (id: number) => api.get<SetMeal>(`/set-meals/${id}`),
  updateSetMeal: (id: number, data: SetMealRequest) => api.put<SetMeal>(`/set-meals/${id}`, data),
  deleteSetMeal: (id: number) => api.delete(`/set-meals/${id}`)
};

export const categorySettingsApi = {
  getCategorySettings: (type?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    return api.get('/category-settings', { params });
  },
  createCategorySetting: (data: { type: string; name: string }) => api.post('/category-settings', data),
  getCategorySettingById: (id: number) => api.get(`/category-settings/${id}`),
  updateCategorySetting: (id: number, data: { type: string; name: string }) => api.put(`/category-settings/${id}`, data),
  deleteCategorySetting: (id: number) => api.delete(`/category-settings/${id}`)
};

export const categoryTypeApi = {
  getCategoryTypes: () => api.get('/category-types'),
  createCategoryType: (data: { code: string; name: string }) => api.post('/category-types', data),
  getCategoryTypeById: (id: number) => api.get(`/category-types/${id}`),
  updateCategoryType: (id: number, data: { code: string; name: string }) => api.put(`/category-types/${id}`, data),
  deleteCategoryType: (id: number) => api.delete(`/category-types/${id}`)
};

export const staffApi = {
  getStaffList: () => api.get('/staff'),
  createStaff: (data: { name: string; gender: string; age: number; phone: string; position: string; positionType: string; registrationTime: string }) => api.post('/staff', data),
  getStaffById: (id: number) => api.get(`/staff/${id}`),
  updateStaff: (id: number, data: { name: string; gender: string; age: number; phone: string; position: string; positionType: string; registrationTime: string }) => api.put(`/staff/${id}`, data),
  deleteStaff: (id: number) => api.delete(`/staff/${id}`)
};

export const vehicleApi = {
  getVehicles: () => api.get('/vehicles'),
  createVehicle: (data: { plateNumber: string; type: string; brand: string; status: string }) => api.post('/vehicles', data),
  getVehicleById: (id: number) => api.get(`/vehicles/${id}`),
  updateVehicle: (id: number, data: { plateNumber: string; type: string; brand: string; status: string }) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id: number) => api.delete(`/vehicles/${id}`)
};

export const staffArrangementApi = {
  saveStaffArrangement: (data: { order_id: number; chefs: string[]; waiters: string[]; drivers: string[]; vehicles: string[]; externalDrivers: {name: string; phone: string; licensePlate: string}[]; departure_time: string; arrival_time: string; remark: string }) => api.post('/orders/staff-arrangement', data),
  getStaffArrangement: (order_id: number) => api.get(`/orders/${order_id}/staff-arrangement`)
};

export { api as axiosInstance };

export default api;