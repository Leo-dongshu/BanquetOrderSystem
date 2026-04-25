<template>
  <div class="create-dish">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加菜品</span>
        </div>
      </template>
      <div class="create-dish-content">
        <el-form :model="dishForm" label-width="120px" @submit.prevent="submitDish">
          <el-form-item label="菜品名称" required>
            <el-input v-model="dishForm.name" placeholder="请输入菜品名称" :class="{ 'error-input': formErrors.name }" />
          </el-form-item>
          <el-form-item label="选择配料" required :class="{ 'error-input': formErrors.ingredients }">
            <el-table :data="selectedIngredients" style="width: 100%">
              <el-table-column prop="name" label="配料名称" width="300" align="center" />
              <el-table-column prop="category" label="分类" width="150" align="center" />
              <el-table-column label="用量" width="200" align="center">
                <template #default="scope">
                  <el-input-number v-model="scope.row.quantity" :min="0.01" :step="0.01" />
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" width="120" align="center" />
              <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="removeIngredient(scope.row.id)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="showIngredientDialog = true" style="margin-top: 10px">添加配料</el-button>
          </el-form-item>
          <el-form-item label="选择盘碗" required>
            <el-select v-model="dishForm.dishware" placeholder="请选择盘碗" :class="{ 'error-input': formErrors.dishware }">
              <el-option v-for="item in dishwareOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择做法" required>
            <el-select v-model="dishForm.cookingMethod" placeholder="请选择做法" :class="{ 'error-input': formErrors.cookingMethod }">
              <el-option v-for="item in cookingMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="做法描述">
            <el-input type="textarea" v-model="dishForm.cookingDescription" placeholder="请输入菜品做法描述" />
          </el-form-item>
          <el-form-item>
            <div class="form-actions">
              <el-button type="success" native-type="submit" :loading="loading">提交菜品</el-button>
              <el-button type="danger" @click="navigateTo('/dishes')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 配料选择对话框 -->
    <el-dialog
      v-model="showIngredientDialog"
      title="选择配料"
      width="900px"
    >
      <div class="dialog-content">
        <div class="filter-section">
          <el-select v-model="selectedCategory" placeholder="按配料分类筛选" style="width: 200px;">
            <el-option label="全部" value="" />
            <el-option v-for="item in ingredientCategoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-table :data="filteredIngredients" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="配料名称" min-width="200" align="center" />
          <el-table-column prop="category" label="分类" min-width="280" align="center" />
          <el-table-column label="用量" min-width="150" align="center">
            <template #default="scope">
              <el-input-number v-model="scope.row.quantity" :min="0.01" :step="0.01" :default="1" style="width: 100%;" />
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" min-width="120" align="center" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showIngredientDialog = false">取消</el-button>
          <el-button type="primary" @click="addSelectedIngredients">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDishStore } from '../store/dish';
import { useIngredientStore } from '../store/ingredient';
import { categorySettingsApi, kitchenwareApi } from '../api';
import { ElMessage } from 'element-plus';
import type { Ingredient } from '../types';

const router = useRouter();
const dishStore = useDishStore();
const ingredientStore = useIngredientStore();

const loading = ref(false);
const showIngredientDialog = ref(false);
const selectedIngredientIds = ref<number[]>([]);
const selectedCategory = ref('');

const dishForm = reactive({
  name: '',
  dishware: '',
  cookingMethod: '',
  cookingDescription: ''
});

// 表单验证标志
const formErrors = reactive({
  name: false,
  dishware: false,
  cookingMethod: false,
  ingredients: false
});

// 盘碗选项
const dishwareOptions = ref<Array<{ value: string; label: string }>>([]);

// 盘碗加载状态
const dishwareLoading = ref(false);

// 做法选项
const cookingMethodOptions = ref<Array<{ value: string; label: string }>>([]);

// 配料类型分类选项
const ingredientCategoryOptions = ref<Array<{ value: string; label: string }>>([]);

const ingredients = ref<Array<Ingredient & { quantity?: number }>>([]);
const selectedIngredients = ref<Array<{ id: number; name: string; category: string; unit: string; quantity: number }>>([]);
// 存储菜品列表，用于检查名称重复
const dishes = ref<any[]>([]);

const filteredIngredients = computed(() => {
  if (!selectedCategory.value) {
    return ingredients.value;
  }
  return ingredients.value.filter(ingredient => ingredient.category === selectedCategory.value);
});

// 监听表单字段的变化，取消红色提醒
watch(() => dishForm.name, (newValue) => {
  if (newValue) {
    formErrors.name = false;
  }
});

watch(() => dishForm.dishware, (newValue) => {
  if (newValue) {
    formErrors.dishware = false;
  }
});

watch(() => dishForm.cookingMethod, (newValue) => {
  if (newValue) {
    formErrors.cookingMethod = false;
  }
});

watch(() => selectedIngredients.value, (newValue) => {
  if (newValue.length > 0) {
    formErrors.ingredients = false;
  }
}, { deep: true });

onMounted(async () => {
  // 并行获取配料、菜品和类别设置数据
  const [ingredientsResponse, dishesResponse, categorySettingsResponse] = await Promise.all([
    ingredientStore.fetchIngredients(),
    dishStore.fetchDishes(),
    categorySettingsApi.getCategorySettings()
  ]);
  
  // 处理配料数据
  ingredients.value = ingredientStore.ingredients.map(ingredient => ({
    ...ingredient,
    quantity: ingredient.quantity || 1 // 使用quantity字段作为默认用量值
  }));
  
  // 处理菜品数据
  dishes.value = dishStore.dishes;
  
  // 处理类别设置数据
  const categorySettings = categorySettingsResponse.data;
  
  // 过滤出菜品做法的类别
  cookingMethodOptions.value = categorySettings
    .filter((item: any) => item.type === '菜品做法')
    .map((item: any) => ({ value: item.name, label: item.name }));
  
  // 过滤出配料类型的类别
  ingredientCategoryOptions.value = categorySettings
    .filter((item: any) => item.type === '配料类型')
    .map((item: any) => ({ value: item.name, label: item.name }));

  // 从厨具管理表获取盘碗数据
  try {
    dishwareLoading.value = true;
    const kitchenwaresResponse = await kitchenwareApi.getKitchenwares();
    dishwareOptions.value = kitchenwaresResponse.data
      .filter((item: any) => item.type === '餐具盘碗')
      .map((item: any) => ({ value: item.name, label: item.name }));
  } catch (error) {
    console.error('获取盘碗列表失败:', error);
    // 如果获取失败，使用类别设置中的餐具类型作为后备
    dishwareOptions.value = categorySettings
      .filter((item: any) => item.type === '餐具类型')
      .map((item: any) => ({ value: item.name, label: item.name }));
  } finally {
    dishwareLoading.value = false;
  }
});

const navigateTo = (path: string) => {
  router.push(path);
};

const handleSelectionChange = (selection: Array<Ingredient & { quantity?: number }>) => {
  selectedIngredientIds.value = selection.map(item => item.id);
};

const addSelectedIngredients = () => {
  selectedIngredientIds.value.forEach(ingredientId => {
    const ingredient = ingredients.value.find(i => i.id === ingredientId);
    if (ingredient && !selectedIngredients.value.find(i => i.id === ingredientId)) {
      selectedIngredients.value.push({
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        quantity: ingredient.quantity || 1
      });
    }
  });
  showIngredientDialog.value = false;
  selectedIngredientIds.value = [];
};

const removeIngredient = (ingredientId: number) => {
  selectedIngredients.value = selectedIngredients.value.filter(ingredient => ingredient.id !== ingredientId);
};

const submitDish = async () => {
  // 重置所有错误标志
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = false;
  });

  // 检查所有必填字段
  let hasError = false;
  
  if (!dishForm.name) {
    formErrors.name = true;
    hasError = true;
  }
  if (!dishForm.dishware) {
    formErrors.dishware = true;
    hasError = true;
  }
  if (!dishForm.cookingMethod) {
    formErrors.cookingMethod = true;
    hasError = true;
  }
  if (selectedIngredients.value.length === 0) {
    formErrors.ingredients = true;
    hasError = true;
  }

  if (hasError) {
    return;
  }

  // 检查是否存在相同名称的菜品
  const existingDish = dishes.value.find(dish => dish.name === dishForm.name);
  if (existingDish) {
    ElMessage.error('已存在相同菜品名称');
    return;
  }

  loading.value = true;
  try {
    const dishData = {
      name: dishForm.name,
      dishware: dishForm.dishware,
      cookingMethod: dishForm.cookingMethod,
      cookingDescription: dishForm.cookingDescription,
      ingredients: selectedIngredients.value.map(ingredient => ({
        ingredient_id: ingredient.id,
        quantity: ingredient.quantity
      }))
    };

    await dishStore.createDish(dishData);
    router.push('/dishes');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-dish {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-dish-content {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-content {
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 15px;
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

:deep(.error-input .el-table) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}
</style>