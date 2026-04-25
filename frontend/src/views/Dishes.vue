<template>
  <div class="dishes">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜品管理</span>
        </div>
      </template>
      <div class="dishes-content">
        <div class="search-container" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索菜品名称"
              style="width: 300px; margin-right: 10px"
              clearable
              @input="handleSearch"
            />
            <el-select
              v-model="searchCookingMethod"
              placeholder="按做法筛选"
              style="width: 200px"
              clearable
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option v-for="method in cookingMethods" :key="method" :label="method" :value="method" />
            </el-select>
          </div>
          <el-button type="primary" @click="navigateTo('/dishes/create')">添加菜品</el-button>
        </div>
        <el-table :data="pagedDishes" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="菜品名称" min-width="120" />
          <el-table-column label="配菜描述" min-width="300">
            <template #default="scope">
              <div v-if="getIngredientDescription(scope.row)">{{ getIngredientDescription(scope.row) }}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="dishware" label="盘碗" min-width="100" />
          <el-table-column prop="cookingMethod" label="做法" min-width="100" />
          <el-table-column prop="cookingDescription" label="做法描述" min-width="200" />
          <el-table-column label="创建时间" min-width="160">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" min-width="100" />
          <el-table-column label="修改时间" min-width="160">
            <template #default="scope">
              {{ formatDate(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="updatedBy" label="修改人" min-width="100" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editDish(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteDish(scope.row.id)">删除</el-button>
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
import { useDishStore } from '../store/dish';
import { formatDate } from '../utils/dateFormat';
import type { Dish } from '../types';

const router = useRouter();
const dishStore = useDishStore();

const dishes = ref<Dish[]>([]);
const loading = ref(false);

// 搜索相关
const searchKeyword = ref('');
const searchCookingMethod = ref('');
const cookingMethods = ref<string[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

onMounted(async () => {
  loading.value = true;
  await dishStore.fetchDishes();
  dishes.value = dishStore.dishes;
  
  // 提取所有做法类型
  const methods = new Set<string>();
  dishes.value.forEach(dish => {
    if (dish.cookingMethod) {
      methods.add(dish.cookingMethod);
    }
  });
  cookingMethods.value = Array.from(methods);
  
  loading.value = false;
});

// 过滤后的菜品列表
const filteredDishes = computed(() => {
  return dishes.value.filter(dish => {
    // 搜索菜品名称
    const nameMatch = !searchKeyword.value || dish.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    // 搜索做法
    const methodMatch = !searchCookingMethod.value || dish.cookingMethod === searchCookingMethod.value;
    return nameMatch && methodMatch;
  });
});

const total = computed(() => filteredDishes.value.length);

const pagedDishes = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredDishes.value.slice(startIndex, endIndex);
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

const editDish = (id: number) => {
  router.push(`/dishes/edit/${id}`);
};

const deleteDish = async (id: number) => {
  try {
    await dishStore.deleteDish(id);
    dishes.value = dishStore.dishes;
    // 如果删除后当前页没有数据，且不是第一页，则跳转到上一页
    if (pagedDishes.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error(error);
  }
};

// 生成配菜描述
const getIngredientDescription = (dish: Dish): string => {
  if (!dish.dish_ingredients || dish.dish_ingredients.length === 0) {
    return '';
  }
  
  return dish.dish_ingredients
    .map(di => {
      const ingredient = di.ingredient || di.Ingredient;
      if (!ingredient) return '';
      return `${ingredient.category}--${ingredient.name}(${di.quantity}_${ingredient.unit})`;
    })
    .filter(Boolean)
    .join('\n');
};
</script>

<style scoped>
.dishes {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dishes-content {
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