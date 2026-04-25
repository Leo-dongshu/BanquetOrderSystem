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
  status: string;
  staff_arranged?: boolean;
  set_meal?: {
    id: number;
    name: string;
    price: number;
    dishes?: Array<{
      dish_id: number;
      quantity: number;
      dish?: {
        id: number;
        name: string;
        dishware: string;
      };
    }>;
  };
  order_dishes?: Array<{
    dish_id: number;
    dish?: {
      id: number;
      name: string;
      price: number;
    };
    Dish?: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface OrderRequest {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_phone2: string;
  service_address: string;
  service_date: string;
  region: string;
  source: string;
  set_meal_id: number;
  feast_time: string;
  feast_type: string;
  booking_days: number;
  deposit: number;
  payment_method: string;
  remark: string;
  formal_tables: number;
  backup_tables: number;
  dishes: Array<{
    dish_id: number;
    quantity: number;
  }>;
}

// 菜品类型
export interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
  dishware: string;
  cookingMethod: string;
  cookingDescription: string;
  created_at: string;
  updated_at: string;
  ingredients?: Array<{
    ingredient_id: number;
    ingredient_name: string;
    quantity: number;
    unit: string;
  }>;
}

export interface DishRequest {
  name: string;
  dishware: string;
  cookingMethod: string;
  cookingDescription: string;
  ingredients: Array<{
    ingredient_id: number;
    quantity: number;
  }>;
}

// 配料类型
export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface IngredientRequest {
  name: string;
  unit: string;
  quantity: number;
  category: string;
}

// 统计类型
export interface IngredientStat {
  name: string;
  total_quantity: number;
  unit: string;
  cost: number;
}

export interface OrderStat {
  total_orders: number;
  total_amount: number;
  average_amount: number;
  daily_stats: Array<{
    date: string;
    amount: number;
  }>;
}

// 日历类型
export interface CalendarData {
  dates: Array<{
    date: string;
    order_count: number;
    amount: number;
  }>;
}

// 套餐类型
export interface SetMeal {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  dishCount: number;
  isVisible: boolean;
  created_at: string;
  updated_at: string;
  set_meal_dishes?: Array<{
    dish_id: number;
    quantity: number;
    dish?: Dish;
    Dish?: Dish;
  }>;
}

export interface SetMealRequest {
  name: string;
  type: string;
  price: number;
  description: string;
  dishes: Array<{
    dish_id: number;
    quantity: number;
  }>;
}
