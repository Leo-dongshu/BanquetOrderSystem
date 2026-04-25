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

// 请求拦截器，添加认证token
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

// 响应拦截器，处理401错误
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

// 订单相关API
export const orderApi = {
  // 获取订单列表
  getOrders: (params?: any) => {
    if (typeof params === 'string') {
      return api.get<Order[]>(`/orders${params ? `?${params}` : ''}`);
    } else {
      return api.get<Order[]>('/orders', { params });
    }
  },
  // 创建订单
  createOrder: (data: OrderRequest) => api.post<Order>('/orders', data),
  // 获取订单详情
  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),
  // 更新订单
  updateOrder: (id: number, data: OrderRequest) => api.put<Order>(`/orders/${id}`, data),
  // 删除订单
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
  // 获取订单菜品
  getOrderDishes: (orderId: number) => api.get<any[]>(`/orders/${orderId}/dishes`),
  // 回款确认
  confirmPayment: (orderId: number, data: { payment_amount: number; discount_amount: number }) => 
    api.post<Order>(`/orders/${orderId}/payment`, data),
  // 获取订单状态列表
  getOrderStatuses: () => api.get<any[]>('/order-statuses')
};

// 菜品相关API
export const dishApi = {
  // 获取菜品列表
  getDishes: () => api.get<Dish[]>('/dishes'),
  // 创建菜品
  createDish: (data: DishRequest) => api.post<Dish>('/dishes', data),
  // 获取菜品详情
  getDishById: (id: number) => api.get<Dish>(`/dishes/${id}`),
  // 更新菜品
  updateDish: (id: number, data: DishRequest) => api.put<Dish>(`/dishes/${id}`, data),
  // 删除菜品
  deleteDish: (id: number) => api.delete(`/dishes/${id}`)
};

// 用料相关API
export const ingredientApi = {
  // 获取用料列表
  getIngredients: (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    return api.get<Ingredient[]>('/ingredients', { params });
  },
  // 创建用料
  createIngredient: (data: IngredientRequest) => api.post<Ingredient>('/ingredients', data),
  // 获取用料详情
  getIngredientById: (id: number) => api.get<Ingredient>(`/ingredients/${id}`),
  // 更新用料
  updateIngredient: (id: number, data: IngredientRequest) => api.put<Ingredient>(`/ingredients/${id}`, data),
  // 删除用料
  deleteIngredient: (id: number) => api.delete(`/ingredients/${id}`)
};

// 厨具相关API
export const kitchenwareApi = {
  // 获取厨具列表
  getKitchenwares: () => api.get<any[]>('/kitchenwares'),
  // 创建厨具
  createKitchenware: (data: any) => api.post<any>('/kitchenwares', data),
  // 获取厨具详情
  getKitchenwareById: (id: number) => api.get<any>(`/kitchenwares/${id}`),
  // 更新厨具
  updateKitchenware: (id: number, data: any) => api.put<any>(`/kitchenwares/${id}`, data),
  // 删除厨具
  deleteKitchenware: (id: number) => api.delete(`/kitchenwares/${id}`)
};

// 统计相关API
export const statsApi = {
  // 获取食材统计
  getIngredientStats: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return api.get<any[]>('/stats/ingredients', { params });
  },
  // 获取订单统计
  getOrderStats: (start_date?: string, end_date?: string) => {
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    return api.get<any>('/stats/orders', { params });
  },
  // 获取仪表盘统计
  getDashboardStats: () => api.get<any>('/stats/dashboard')
};

// 日历相关API
export const calendarApi = {
  // 获取订单日历数据
  getOrderCalendar: () => api.get<CalendarData>('/calendar/orders')
};

// 套餐相关API
export const setMealApi = {
  // 获取套餐列表
  getSetMeals: () => api.get<SetMeal[]>('/set-meals'),
  // 创建套餐
  createSetMeal: (data: SetMealRequest) => api.post<SetMeal>('/set-meals', data),
  // 获取套餐详情
  getSetMealById: (id: number) => api.get<SetMeal>(`/set-meals/${id}`),
  // 更新套餐
  updateSetMeal: (id: number, data: SetMealRequest) => api.put<SetMeal>(`/set-meals/${id}`, data),
  // 删除套餐
  deleteSetMeal: (id: number) => api.delete(`/set-meals/${id}`)
};



// 类别设置API
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

// 类别类型API
export const categoryTypeApi = {
  getCategoryTypes: () => api.get('/category-types'),
  createCategoryType: (data: { code: string; name: string }) => api.post('/category-types', data),
  getCategoryTypeById: (id: number) => api.get(`/category-types/${id}`),
  updateCategoryType: (id: number, data: { code: string; name: string }) => api.put(`/category-types/${id}`, data),
  deleteCategoryType: (id: number) => api.delete(`/category-types/${id}`)
};

// 人员管理API
export const staffApi = {
  getStaffList: () => api.get('/staff'),
  createStaff: (data: { name: string; gender: string; age: number; phone: string; position: string; positionType: string; registrationTime: string }) => api.post('/staff', data),
  getStaffById: (id: number) => api.get(`/staff/${id}`),
  updateStaff: (id: number, data: { name: string; gender: string; age: number; phone: string; position: string; positionType: string; registrationTime: string }) => api.put(`/staff/${id}`, data),
  deleteStaff: (id: number) => api.delete(`/staff/${id}`)
};

// 车辆管理API
export const vehicleApi = {
  getVehicles: () => api.get('/vehicles'),
  createVehicle: (data: { plateNumber: string; type: string; brand: string; status: string }) => api.post('/vehicles', data),
  getVehicleById: (id: number) => api.get(`/vehicles/${id}`),
  updateVehicle: (id: number, data: { plateNumber: string; type: string; brand: string; status: string }) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id: number) => api.delete(`/vehicles/${id}`)
};

// 人员安排API
export const staffArrangementApi = {
  saveStaffArrangement: (data: { order_id: number; chefs: string[]; waiters: string[]; drivers: string[]; vehicles: string[]; externalDrivers: {name: string; phone: string; licensePlate: string}[]; departure_time: string; arrival_time: string; remark: string }) => api.post('/orders/staff-arrangement', data),
  getStaffArrangement: (order_id: number) => api.get(`/orders/${order_id}/staff-arrangement`)
};

// 导出 axios 实例
export { api as axiosInstance };

// 默认导出 api
export default api;