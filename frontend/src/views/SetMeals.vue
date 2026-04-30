<template>
  <div class="set-meals">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>套餐管理</span>
        </div>
      </template>
      <div class="set-meals-content">
        <div class="search-container" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索套餐名称"
              style="width: 300px; margin-right: 10px"
              clearable
              @input="handleSearch"
            />
            <el-select
              v-model="searchType"
              placeholder="按套餐类型筛选"
              style="width: 200px"
              clearable
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option v-for="type in setMealTypes" :key="type" :label="type" :value="type" />
            </el-select>
          </div>
          <el-button type="primary" @click="navigateTo('/set-meals/create')">添加套餐</el-button>
        </div>
        <el-table :data="pagedSetMeals" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="套餐名称" min-width="150" />
          <el-table-column prop="type" label="套餐类型" min-width="120" />
          <el-table-column prop="price" label="套餐价格" min-width="100" />
          <el-table-column prop="dishCount" label="菜品数量" min-width="100" />
          <el-table-column label="是否上架" min-width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.isVisible" active-color="#13ce66" inactive-color="#ff4949" @change="toggleVisibility(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="修改时间" min-width="180">
            <template #default="scope">
              {{ formatDate(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editSetMeal(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteSetMeal(scope.row.id)">删除</el-button>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSetMealStore } from '../store/setMeal';
import { formatDate } from '../utils/dateFormat';
import type { SetMeal } from '../types';
import { ElMessageBox, ElMessage } from 'element-plus';
import { setMealApi } from '../api';

const router = useRouter();
const setMealStore = useSetMealStore();

const setMeals = ref<SetMeal[]>([]);
const loading = ref(false);

// 搜索相关
const searchKeyword = ref('');
const searchType = ref('');
const setMealTypes = ref<string[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

onMounted(async () => {
  loading.value = true;
  await setMealStore.fetchSetMeals();
  setMeals.value = setMealStore.setMeals;
  
  // 提取所有套餐类型
  const types = new Set<string>();
  setMeals.value.forEach(setMeal => {
    if (setMeal.type) {
      types.add(setMeal.type);
    }
  });
  setMealTypes.value = Array.from(types);
  
  loading.value = false;
});

// 过滤后的套餐列表
const filteredSetMeals = computed(() => {
  return setMeals.value.filter(setMeal => {
    // 搜索套餐名称
    const nameMatch = !searchKeyword.value || setMeal.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    // 搜索套餐类型
    const typeMatch = !searchType.value || setMeal.type === searchType.value;
    return nameMatch && typeMatch;
  });
});

const total = computed(() => filteredSetMeals.value.length);

const pagedSetMeals = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredSetMeals.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 重置页码到第一页
};

const navigateTo = (path: string) => {
  router.push(path);
};

const editSetMeal = (id: number) => {
  router.push(`/set-meals/edit/${id}`);
};

const toggleVisibility = async (setMeal: SetMeal) => {
  try {
    await setMealApi.toggleVisibility(setMeal.id, setMeal.isVisible);
    ElMessage.success(setMeal.isVisible ? '已上架' : '已下架');
  } catch (error) {
    setMeal.isVisible = !setMeal.isVisible;
    ElMessage.error('操作失败');
  }
};

const deleteSetMeal = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该套餐吗？删除后不可恢复。', '删除确认', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await setMealStore.deleteSetMeal(id);
    setMeals.value = setMealStore.setMeals;
    ElMessage.success('删除套餐成功');
    if (pagedSetMeals.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(error);
      ElMessage.error('删除套餐失败');
    }
  }
};
</script>

<style scoped>
.set-meals {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.set-meals-content {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 表格列居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center !important;
  vertical-align: middle !important;
}

/* 表格单元格内容居中 */
:deep(.el-table th .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
}

/* 表格数据单元格内容居中，支持多行文本 */
:deep(.el-table td .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
  white-space: pre-wrap !important;
  word-break: break-all !important;
}
</style>
