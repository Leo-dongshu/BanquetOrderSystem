<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="navigateTo('/users/create')">添加用户</el-button>
        </div>
      </template>
      <div class="users-content">
        <el-table :data="pagedUsers" style="width: 100%" v-loading="loading">
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="role" label="角色" min-width="100" />
          <el-table-column label="创建时间" min-width="160">
            <template #default="scope">{{ formatDate(scope.row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="160">
            <template #default="scope">{{ formatDate(scope.row.updated_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="navigateTo(`/users/edit/${scope.row.id}`)" :disabled="scope.row.username === 'system'">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)" :disabled="scope.row.username === 'system' || scope.row.id === authStore.user?.id">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container" v-if="total > 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { useAuthStore } from '../store/auth';
import { formatDate } from '../utils/dateFormat';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const loading = ref(false);
const users = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => users.value.length);
const pagedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return users.value.slice(startIndex, endIndex);
});

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    await userStore.fetchUsers();
    users.value = userStore.users;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

const deleteUser = async (userId: number) => {
  try {
    await userStore.deleteUser(userId);
    await fetchUsers();
  } catch (error) {
    console.error(error);
  }
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};
</script>

<style scoped>
.users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.users-content {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>