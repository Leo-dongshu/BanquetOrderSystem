<template>
  <div class="create-set-meal">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加套餐</span>
        </div>
      </template>
      <div class="create-set-meal-content">
        <el-form :model="setMealForm" label-width="120px" @submit.prevent="submitSetMeal">
          <el-form-item label="套餐类型" required>
            <el-select v-model="setMealForm.type" placeholder="请选择套餐类型" :class="{ 'error-input': formErrors.type }">
              <el-option v-for="item in setMealTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐名称" required>
            <el-input v-model="setMealForm.name" placeholder="请输入套餐名称" :class="{ 'error-input': formErrors.name }" />
          </el-form-item>
          <el-form-item label="套餐价格" required>
            <el-input-number v-model="setMealForm.price" :min="0" :step="0.01" placeholder="请输入套餐价格" :class="{ 'error-input': formErrors.price }" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="setMealForm.description" placeholder="请输入套餐描述" />
          </el-form-item>
          <el-form-item label="菜品选择" required :class="{ 'error-input': formErrors.dishes }">
            <div class="dish-selection">
              <div class="dish-selection-header">
                <span class="selected-count">已选择 {{ selectedDishes.length }} 个</span>
              </div>
              <div class="dish-groups">
                <div v-if="Object.keys(groupedDishes).length > 0">
                  <div v-for="(dishGroup, method) in groupedDishes" :key="method" class="dish-group">
                    <div class="dish-group-title">{{ method }}</div>
                    <div class="dish-group-items">
                      <div v-for="dish in dishGroup" :key="dish.id" class="dish-item">
                        <el-checkbox v-model="dish.checked" @change="handleDishCheck(dish)">
                          {{ dish.name }}
                        </el-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-dishes">
                  暂无菜品数据
                </div>
              </div>
            </div>
            <el-table :data="selectedDishes" style="width: 100%; margin-top: 20px">
              <el-table-column prop="name" label="菜品名称" />
              <el-table-column prop="dishware" label="盘碗" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="removeDish(scope.row.id)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit" :loading="loading">提交套餐</el-button>
              <el-button @click="navigateTo('/set-meals')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 菜品选择对话框 -->
    <el-dialog
      v-model="showDishDialog"
      title="选择菜品"
      width="800px"
    >
      <el-table :data="dishes" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="菜品ID" width="80" />
        <el-table-column prop="name" label="菜品名称" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="description" label="描述" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDishDialog = false">取消</el-button>
          <el-button type="primary" @click="addSelectedDishes">确定</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSetMealStore } from '../store/setMeal';
import { useDishStore } from '../store/dish';
import { categorySettingsApi } from '../api';
import type { Dish } from '../types';

const router = useRouter();
const setMealStore = useSetMealStore();
const dishStore = useDishStore();

const loading = ref(false);
const showDishDialog = ref(false);
const selectedDishIds = ref<number[]>([]);

// 套餐类型选项
const setMealTypeOptions = ref<Array<{ value: string; label: string }>>([]);

const setMealForm = reactive({
  name: '',
  type: '',
  price: 0,
  description: ''
});

// 表单验证标志
const formErrors = reactive({
  name: false,
  type: false,
  price: false,
  dishes: false
});

const dishes = ref<Array<Dish & { checked?: boolean }>>([]);
const selectedDishes = ref<Array<{ id: number; name: string; dishware: string; quantity: number }>>([]);

// 按做法分组的菜品
const groupedDishes = computed(() => {
  const groups: Record<string, Array<Dish & { checked?: boolean }>> = {};
  if (dishes.value && dishes.value.length > 0) {
    dishes.value.forEach(dish => {
      const method = dish.cookingMethod || '其他';
      if (!groups[method]) {
        groups[method] = [];
      }
      groups[method].push(dish);
    });
  }
  return groups;
});

// 监听表单字段的变化，取消红色提醒
watch(() => setMealForm.name, (newValue) => {
  if (newValue) {
    formErrors.name = false;
  }
});

watch(() => setMealForm.type, (newValue) => {
  if (newValue) {
    formErrors.type = false;
  }
});

watch(() => setMealForm.price, (newValue) => {
  if (newValue) {
    formErrors.price = false;
  }
});

watch(() => selectedDishes.value, (newValue) => {
  if (newValue.length > 0) {
    formErrors.dishes = false;
  }
}, { deep: true });

onMounted(async () => {
  // 并行获取菜品和类别设置数据
  const [dishesResponse, categorySettingsResponse] = await Promise.all([
    dishStore.fetchDishes(),
    categorySettingsApi.getCategorySettings()
  ]);
  
  dishes.value = dishStore.dishes;
  
  // 处理类别设置数据，过滤出套餐类型的类别
  const categorySettings = categorySettingsResponse.data;
  setMealTypeOptions.value = categorySettings
    .filter((item: any) => item.type === '套餐类型')
    .map((item: any) => ({ value: item.name, label: item.name }));
});

const navigateTo = (path: string) => {
  router.push(path);
};

const handleSelectionChange = (selection: Dish[]) => {
  selectedDishIds.value = selection.map(item => item.id);
};

const addSelectedDishes = () => {
  selectedDishIds.value.forEach(dishId => {
    const dish = dishes.value.find(d => d.id === dishId);
    if (dish && !selectedDishes.value.find(d => d.id === dishId)) {
      selectedDishes.value.push({
        id: dish.id,
        name: dish.name,
        dishware: dish.dishware || '',
        quantity: 1
      });
    }
  });
  showDishDialog.value = false;
  selectedDishIds.value = [];
};

const removeDish = (dishId: number) => {
  selectedDishes.value = selectedDishes.value.filter(dish => dish.id !== dishId);
};

// 处理菜品勾选
const handleDishCheck = (dish: Dish & { checked?: boolean }) => {
  if (dish.checked) {
    // 勾选菜品，添加到已选择列表
    if (!selectedDishes.value.find(d => d.id === dish.id)) {
      selectedDishes.value.push({
        id: dish.id,
        name: dish.name,
        dishware: dish.dishware || '',
        quantity: 1
      });
    }
  } else {
    // 取消勾选，从已选择列表中移除
    selectedDishes.value = selectedDishes.value.filter(d => d.id !== dish.id);
  }
};

const submitSetMeal = async () => {
  console.log('submitSetMeal called');
  console.log('setMealForm:', setMealForm);
  console.log('selectedDishes:', selectedDishes.value);
  
  // 重置所有错误标志
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = false;
  });

  // 检查所有必填字段
  let hasError = false;
  
  if (!setMealForm.name) {
    formErrors.name = true;
    hasError = true;
  }
  if (!setMealForm.type) {
    formErrors.type = true;
    hasError = true;
  }
  if (!setMealForm.price) {
    formErrors.price = true;
    hasError = true;
  }
  if (selectedDishes.value.length === 0) {
    formErrors.dishes = true;
    hasError = true;
  }

  if (hasError) {
    console.log('Validation failed');
    return;
  }

  loading.value = true;
  try {
    const setMealData = {
      name: setMealForm.name,
      type: setMealForm.type,
      price: setMealForm.price,
      description: setMealForm.description,
      dishes: selectedDishes.value.map(dish => ({
        dish_id: dish.id,
        quantity: dish.quantity
      }))
    };
    
    console.log('setMealData:', setMealData);

    await setMealStore.createSetMeal(setMealData);
    console.log('Set meal created successfully');
    router.push('/set-meals');
  } catch (error) {
    console.error('Error creating set meal:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-set-meal {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-set-meal-content {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

/* 菜品选择区域样式 */
.dish-selection {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 100%;
}

.dish-selection-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.selected-count {
  font-weight: bold;
  color: #409eff;
}

.dish-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 15px 15px;
}

.dish-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dish-group-title {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 5px;
}

.dish-group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.dish-item {
  margin-right: 20px;
  margin-bottom: 10px;
}

.no-dishes {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
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

/* 错误输入框样式 */
:deep(.error-input .el-input__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}

:deep(.error-input .el-input-number__decrease),
:deep(.error-input .el-input-number__increase) {
  border-color: #f56c6c !important;
}

:deep(.error-input .el-select__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}

:deep(.error-input .dish-selection) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}
</style>
