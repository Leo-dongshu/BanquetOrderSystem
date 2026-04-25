// 订单类型
export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_phone2: string;
  service_address: string;
  service_date: string;
  region: string;
  source: string;
  receiver_id: number;
  set_meal_id: number;
  feast_time: string;
  feast_type: string;
  booking_days: number;
  deposit: number;
  payment_method: string;
  remark: string;
  formal_tables: number;
  backup_tables: number;
  total_amount: number;
  status: number;
  createdBy: string;
  updatedBy: string;
  created_at: string;
  updated_at: string;
  order_dishes?: OrderDish[];
  set_meal?: SetMeal;
  receiver?: any;
}

// 订单菜品关联类型
export interface OrderDish {
  id: number;
  order_id: number;
  dish_id: number;
  quantity: number;
  created_at: string;
  dish?: Dish;
}

// 菜品类型
export interface Dish {
  id: number;
  name: string;
  price?: number;
  description: string;
  dishware?: string;
  cookingMethod?: string;
  cookingDescription?: string;
  created_at: string;
  updated_at: string;
  dish_ingredients?: DishIngredient[];
}

// 菜品用料关联类型
export interface DishIngredient {
  id: number;
  dish_id: number;
  ingredient_id: number;
  quantity: number;
  created_at: string;
  ingredient?: Ingredient;
}

// 用料类型
export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  category: string;
  created_at: string;
  updated_at: string;
}

// 食材统计类型
export interface IngredientStat {
  id: number;
  name: string;
  total_quantity: number;
}

// 订单统计类型
export interface OrderStat {
  total_orders: number;
  total_amount: number;
  table_count: number;
  status_count: Record<string, number>;
}

// 日历订单类型
export interface CalendarOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  table_count: number;
  total_amount: number;
  status: string;
}

// 日历数据类型
export interface CalendarData {
  [date: string]: CalendarOrder[];
}

// 订单创建/更新请求类型
export interface OrderRequest {
  customer_name?: string;
  customer_phone?: string;
  service_address?: string;
  service_date?: string;
  table_count?: number;
  dishes?: {
    dish_id: number;
    quantity: number;
  }[];
  set_meals?: {
    set_meal_id: number;
  }[];
  status?: string;
}

// 菜品创建/更新请求类型
export interface DishRequest {
  name: string;
  price: number;
  description: string;
  ingredients: {
    ingredient_id: number;
    quantity: number;
  }[];
}

// 用料创建/更新请求类型
export interface IngredientRequest {
  name: string;
  unit: string;
  quantity?: number;
  category: string;
}

// 套餐类型
export interface SetMeal {
  id: number;
  name: string;
  price: number;
  description: string;
  status?: string;
  type?: string;
  dishCount?: number;
  isVisible?: boolean;
  sort?: number;
  created_at: string;
  updated_at: string;
  createdBy?: string;
  updatedBy?: string;
  set_meal_dishes?: SetMealDish[];
}

// 套餐菜品关联类型
export interface SetMealDish {
  id: number;
  set_meal_id: number;
  dish_id: number;
  quantity: number;
  created_at: string;
  dish?: Dish;
}

// 套餐创建/更新请求类型
export interface SetMealRequest {
  name: string;
  price: number;
  description: string;
  dishes: {
    dish_id: number;
    quantity: number;
  }[];
}