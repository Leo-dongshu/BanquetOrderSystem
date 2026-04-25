<template>
  <div class="register">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>注册</span>
        </div>
      </template>
      <div class="register-content">
        <el-form :model="registerForm" label-width="80px" @submit.prevent="register">
          <el-form-item label="用户名" required>
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" required>
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="registerForm.role" placeholder="选择角色">
              <el-option label="普通用户" value="user" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading">注册</el-button>
            <el-button @click="router.push('/login')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const registerForm = reactive({
  username: '',
  password: '',
  role: 'user'
});

const register = async () => {
  if (!registerForm.username || !registerForm.password) {
    return;
  }

  loading.value = true;
  try {
    await authStore.register(registerForm.username, registerForm.password, registerForm.role);
    router.push('/login');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.register-content {
  padding: 20px;
}
</style>