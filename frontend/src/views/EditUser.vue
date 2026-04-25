<template>
  <div class="edit-user">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑用户</span>
        </div>
      </template>
      <div class="edit-user-content">
        <el-form :model="userForm" label-width="100px" @submit.prevent="updateUser">
          <el-form-item label="用户名" required>
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userForm.password" type="password" placeholder="请输入密码（不修改请留空）" />
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const userForm = reactive({
  username: '',
  password: '',
  role: 'user'
});

onMounted(async () => {
  const userId = Number(route.params.id);
  if (userId) {
    await fetchUser(userId);
  }
});

const fetchUser = async (userId: number) => {
  loading.value = true;
  try {
    const user = await userStore.fetchUserById(userId);
    // 如果是system用户，直接返回列表页
    if (user.username === 'system') {
      ElMessage.warning('system用户不可编辑');
      router.push('/users');
      return;
    }
    userForm.username = user.username;
    userForm.role = user.role;
  } catch (error: any) {
    console.error(error);
    ElMessage.error(error.response?.data?.error || '获取用户详情失败');
  } finally {
    loading.value = false;
  }
};

const updateUser = async () => {
  if (!userForm.username) {
    ElMessage.warning('请填写用户名');
    return;
  }

  const userId = Number(route.params.id);
  if (!userId) return;

  loading.value = true;
  try {
    // 再次检查是否是system用户
    const user = await userStore.fetchUserById(userId);
    if (user.username === 'system') {
      ElMessage.warning('system用户不可编辑');
      router.push('/users');
      return;
    }

    // 只发送有值的字段
    const updateData: any = {
      username: userForm.username,
      role: userForm.role
    };
    if (userForm.password) {
      updateData.password = userForm.password;
    }

    await userStore.updateUser(userId, updateData);
    ElMessage.success('用户更新成功');
    router.push('/users');
  } catch (error: any) {
    console.error(error);
    ElMessage.error(error.response?.data?.error || '更新用户失败');
  } finally {
    loading.value = false;
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.edit-user {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-user-content {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}
</style>