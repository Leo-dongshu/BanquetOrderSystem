<template>
  <div class="create-user">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加用户</span>
        </div>
      </template>
      <div class="create-user-content">
        <el-form :model="userForm" label-width="100px" @submit.prevent="createUser">
          <el-form-item label="用户名" required>
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" required>
            <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="角色" required>
            <el-select v-model="userForm.role" placeholder="选择角色">
              <el-option label="普通用户" value="user" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit" :loading="loading">提交</el-button>
              <el-button @click="navigateTo('/users')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const userForm = reactive({
  username: '',
  password: '',
  role: 'user'
});

const createUser = async () => {
  if (!userForm.username || !userForm.password) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  loading.value = true;
  try {
    await userStore.createUser(userForm);
    ElMessage.success('用户创建成功');
    router.push('/users');
  } catch (error: any) {
    console.error(error);
    ElMessage.error(error.response?.data?.error || '创建用户失败');
  } finally {
    loading.value = false;
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.create-user {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-user-content {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}
</style>