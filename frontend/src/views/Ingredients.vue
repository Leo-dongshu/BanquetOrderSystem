<template>
  <div class="ingredients">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>配料管理</span>
        </div>
      </template>
      <div class="ingredients-content">
        <div class="search-container" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <el-select
            v-model="selectedCategory"
            placeholder="请选择分类"
            style="width: 300px"
            @change="handleCategoryChange"
          >
            <el-option label="全部" value="" />
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name" />
          </el-select>
          <el-button type="primary" @click="navigateTo('/ingredients/create')">添加配料</el-button>
        </div>
        <el-table :data="pagedIngredients" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="配料名称" min-width="120" />
          <el-table-column prop="category" label="分类" min-width="100" />
          <el-table-column prop="quantity" label="用量" min-width="80" />
          <el-table-column prop="unit" label="单位" min-width="80" />
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
              <el-button type="primary" size="small" @click="editIngredient(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteIngredient(scope.row.id)">删除</el-button>
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
import { useIngredientStore } from '../store/ingredient';
import { formatDate } from '../utils/dateFormat';
import { categorySettingsApi } from '../api';
import type { Ingredient } from '../types';

const router = useRouter();
const ingredientStore = useIngredientStore();

const ingredients = ref<Ingredient[]>([]);
const loading = ref(false);
const categories = ref<any[]>([]);
const selectedCategory = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

onMounted(async () => {
  loading.value = true;
  try {
    // 并行获取用料和分类数据
    const [ingredientsResponse, categoriesResponse] = await Promise.all([
      ingredientStore.fetchIngredients(),
      categorySettingsApi.getCategorySettings()
    ]);
    ingredients.value = ingredientStore.ingredients;
    // 过滤出配料类型的数据
    categories.value = categoriesResponse.data.filter((item: any) => item.type === '配料类型');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const filteredIngredients = computed(() => {
  let result = ingredients.value;
  if (selectedCategory.value) {
    result = result.filter(ingredient => 
      ingredient.category === selectedCategory.value
    );
  }
  return result;
});

const total = computed(() => filteredIngredients.value.length);

const pagedIngredients = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredIngredients.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

const handleCategoryChange = () => {
  currentPage.value = 1; // 重置页码到第一页
};

const navigateTo = (path: string) => {
  router.push(path);
};

const editIngredient = (id: number) => {
  router.push(`/ingredients/edit/${id}`);
};

const deleteIngredient = async (id: number) => {
  try {
    await ingredientStore.deleteIngredient(id);
    ingredients.value = ingredientStore.ingredients;
    // 如果删除后当前页没有数据，且不是第一页，则跳转到上一页
    if (pagedIngredients.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.ingredients {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ingredients-content {
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
:deep(.el-table th .cell),
:deep(.el-table td .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
}
</style>