<template>
  <div class="app">
    <template v-if="!isAuthPage">
      <el-container>
        <el-header height="64px" class="header">
          <div class="header-left">
            <div class="logo">
              <el-icon :size="28"><Dish /></el-icon>
            </div>
            <span class="logo-text">流水宴席酒店订单管理系统</span>
          </div>
          <div class="header-right">
            <div class="user-info" v-if="authStore.isAuthenticated">
              <div class="user-avatar">
                <el-icon :size="20"><User /></el-icon>
              </div>
              <span class="username">{{ authStore.user?.username }}</span>
              <el-divider direction="vertical" />
              <el-button type="text" class="logout-btn" @click="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出</span>
              </el-button>
            </div>
          </div>
        </el-header>
        <el-container>
          <el-aside width="220px" class="aside">
            <div class="menu-header">
              <span>菜单导航</span>
            </div>
            <el-menu
              :default-active="activeMenu"
              class="menu"
              router
              :collapse="false"
            >
              <el-menu-item index="/">
                <el-icon><HomeFilled /></el-icon>
                <template #title>首页</template>
              </el-menu-item>
              
              <el-sub-menu index="/order-management">
                <template #title>
                  <el-icon><List /></el-icon>
                  <span>套餐订单管理</span>
                </template>
                <el-menu-item index="/orders">
                  <el-icon><Document /></el-icon>
                  <template #title>订单信息管理</template>
                </el-menu-item>
                <el-menu-item index="/orders/staff-arrangement">
                  <el-icon><User /></el-icon>
                  <template #title>订单人员安排</template>
                </el-menu-item>
                <el-menu-item index="/orders/delivery-management">
                  <el-icon><Van /></el-icon>
                  <template #title>订单发货管理</template>
                </el-menu-item>
                <el-menu-item index="/orders/payment-management">
                  <el-icon><Money /></el-icon>
                  <template #title>订单回款管理</template>
                </el-menu-item>
              </el-sub-menu>
              
              <el-menu-item index="/set-meals">
                <el-icon><Star /></el-icon>
                <template #title>套餐管理</template>
              </el-menu-item>
              
              <el-sub-menu index="/equipment">
                <template #title>
                  <el-icon><Tools /></el-icon>
                  <span>地区菜管理</span>
                </template>
                <el-menu-item index="/dishes">
                  <el-icon><Food /></el-icon>
                  <template #title>菜品管理</template>
                </el-menu-item>
                <el-menu-item index="/ingredients">
                  <el-icon><Collection /></el-icon>
                  <template #title>配料管理</template>
                </el-menu-item>
                <el-menu-item index="/kitchenware">
                  <el-icon><Monitor /></el-icon>
                  <template #title>厨具管理</template>
                </el-menu-item>
              </el-sub-menu>
              

              
              <el-sub-menu index="/shop-management">
                <template #title>
                  <el-icon><Shop /></el-icon>
                  <span>店铺管理</span>
                </template>
                <el-menu-item index="/shop-management/staff">
                  <el-icon><UserFilled /></el-icon>
                  <template #title>人员管理</template>
                </el-menu-item>
                <el-menu-item index="/shop-management/vehicle">
                  <el-icon><Van /></el-icon>
                  <template #title>车辆管理</template>
                </el-menu-item>
              </el-sub-menu>
              
              <el-menu-item index="/category-settings">
                <el-icon><Setting /></el-icon>
                <template #title>类别设置</template>
              </el-menu-item>
              
              <el-menu-item index="/users">
                <el-icon><User /></el-icon>
                <template #title>用户管理</template>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="main">
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  HomeFilled, List, Grid, Collection, 
  Calendar, Star, User, SwitchButton, Tools, 
  CollectionTag, Document, Shop, Van, Money, 
  Dish, Food, Monitor, UserFilled, Setting
} from '@element-plus/icons-vue';
import { useAuthStore } from './store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activeMenu = computed(() => {
  return route.path;
});

const isAuthPage = computed(() => {
  const authPaths = ['/login', '/register'];
  return authPaths.includes(route.path);
});

const logout = async () => {
  authStore.logout();
  router.push('/login');
};

onMounted(async () => {
  if (!authStore.isAuthenticated && route.path !== '/login') {
    authStore.token = 'test-token';
    authStore.user = {
      id: 1,
      username: '管理员',
      role: 'admin'
    };
  }
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.logout-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.aside {
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}

.menu-header {
  padding: 16px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #e4e7ed;
}

.menu {
  height: calc(100% - 53px);
  border-right: none;
  overflow-y: auto;
}

.menu:not(.el-menu--collapse) {
  width: 220px;
}

.menu :deep(.el-menu-item),
.menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
}

.menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 52px !important;
}

.menu :deep(.el-icon) {
  font-size: 18px;
}

.main {
  padding: 0;
  overflow-y: auto;
  background: #f5f7fa;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>