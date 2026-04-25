<template>
  <div class="create-ingredient">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加配料</span>
        </div>
      </template>
      <div class="create-ingredient-content">
        <el-form :model="ingredientForm" label-width="120px" @submit.prevent="submitIngredient">
          <el-form-item label="配料名称" required>
            <el-input v-model="ingredientForm.name" placeholder="请输入配料名称" :class="{ 'error-input': formErrors.name }" />
          </el-form-item>
          <el-form-item label="用量">
            <el-input-number v-model="ingredientForm.quantity" :min="0" :step="0.01" placeholder="请输入用量" />
          </el-form-item>
          <el-form-item label="单位" required>
            <el-input v-model="ingredientForm.unit" placeholder="请输入计量单位" :class="{ 'error-input': formErrors.unit }" />
          </el-form-item>
          <el-form-item label="分类" required>
            <el-select v-model="ingredientForm.category" placeholder="请选择配料分类" :class="{ 'error-input': formErrors.category }">
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit" :loading="loading">提交配料</el-button>
              <el-button @click="navigateTo('/ingredients')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIngredientStore } from '../store/ingredient';
import { categorySettingsApi } from '../api';

const router = useRouter();
const ingredientStore = useIngredientStore();

const loading = ref(false);
const categories = ref<any[]>([]);

const ingredientForm = reactive({
  name: '',
  unit: '',
  quantity: 100,
  category: ''
});

// 表单验证标志
const formErrors = reactive({
  name: false,
  unit: false,
  category: false
});

const navigateTo = (path: string) => {
  router.push(path);
};

const fetchCategories = async () => {
  try {
    const response = await categorySettingsApi.getCategorySettings();
    // 过滤出配料类型的数据
    categories.value = response.data.filter((item: any) => item.type === '配料类型');
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

// 监听表单字段的变化，取消红色提醒
watch(() => ingredientForm.name, (newValue) => {
  if (newValue) {
    formErrors.name = false;
  }
});

watch(() => ingredientForm.unit, (newValue) => {
  if (newValue) {
    formErrors.unit = false;
  }
});

watch(() => ingredientForm.category, (newValue) => {
  if (newValue) {
    formErrors.category = false;
  }
});

onMounted(() => {
  fetchCategories();
});

const submitIngredient = async () => {
  // 重置所有错误标志
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = false;
  });

  // 检查所有必填字段
  let hasError = false;
  
  if (!ingredientForm.name) {
    formErrors.name = true;
    hasError = true;
  }
  if (!ingredientForm.unit) {
    formErrors.unit = true;
    hasError = true;
  }
  if (!ingredientForm.category) {
    formErrors.category = true;
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    const ingredientData = {
      name: ingredientForm.name,
      unit: ingredientForm.unit,
      quantity: ingredientForm.quantity,
      category: ingredientForm.category
    };

    await ingredientStore.createIngredient(ingredientData);
    router.push('/ingredients');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-ingredient {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-ingredient-content {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

/* 错误输入框样式 */
:deep(.error-input .el-input__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}

:deep(.error-input .el-select__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}
</style>