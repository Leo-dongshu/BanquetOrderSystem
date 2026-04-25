import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/create',
    name: 'CreateOrder',
    component: () => import('../views/CreateOrder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/edit/:id',
    name: 'EditOrder',
    component: () => import('../views/EditOrder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/staff-arrangement',
    name: 'OrderStaffArrangement',
    component: () => import('../views/OrderStaffArrangement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/delivery-management',
    name: 'OrderDeliveryManagement',
    component: () => import('../views/OrderDeliveryManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/payment-management',
    name: 'OrderPaymentManagement',
    component: () => import('../views/OrderPaymentManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-meals',
    name: 'SetMeals',
    component: () => import('../views/SetMeals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-meals/create',
    name: 'CreateSetMeal',
    component: () => import('../views/CreateSetMeal.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/set-meals/edit/:id',
    name: 'EditSetMeal',
    component: () => import('../views/EditSetMeal.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dishes',
    name: 'Dishes',
    component: () => import('../views/Dishes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dishes/create',
    name: 'CreateDish',
    component: () => import('../views/CreateDish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dishes/edit/:id',
    name: 'EditDish',
    component: () => import('../views/EditDish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ingredients',
    name: 'Ingredients',
    component: () => import('../views/Ingredients.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ingredients/create',
    name: 'CreateIngredient',
    component: () => import('../views/CreateIngredient.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/ingredients/edit/:id', name: 'EditIngredient', component: () => import('../views/EditIngredient.vue'), meta: { requiresAuth: true } },
  { path: '/kitchenware', name: 'Kitchenware', component: () => import('../views/Kitchenware.vue'), meta: { requiresAuth: true } },
  { path: '/kitchenware/create', name: 'CreateKitchenware', component: () => import('../views/CreateKitchenware.vue'), meta: { requiresAuth: true } },
  { path: '/kitchenware/edit/:id', name: 'EditKitchenware', component: () => import('../views/EditKitchenware.vue'), meta: { requiresAuth: true } },

  {
    path: '/shop-management/staff',
    name: 'StaffManagement',
    component: () => import('../views/ShopManagement/Staff.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shop-management/vehicle',
    name: 'VehicleManagement',
    component: () => import('../views/ShopManagement/Vehicle.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/category-settings',
    name: 'CategorySettings',
    component: () => import('../views/CategorySettings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/create',
    name: 'CreateUser',
    component: () => import('../views/CreateUser.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/edit/:id',
    name: 'EditUser',
    component: () => import('../views/EditUser.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth !== false;
  
  if (requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;