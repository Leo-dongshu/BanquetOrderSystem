<template>
  <div class="create-kitchenware">
    <el-card class="kitchenware-card">
      <template #header>
        <div class="card-header">
          <span>新增厨具</span>
        </div>
      </template>
      <div class="kitchenware-form">
        <el-form :model="form" label-position="top" :rules="rules" ref="formRef">
          <el-form-item label="厨具名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入厨具名称" />
          </el-form-item>
          <el-form-item label="厨具类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择厨具类型">
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="厨具数量" prop="quantity">
            <div class="quantity-input">
              <el-button type="primary" @click="decrementQuantity" :disabled="form.quantity <= 0">-</el-button>
              <el-input v-model.number="form.quantity" type="number" min="0" style="width: 200px; text-align: center;" />
              <el-button type="primary" @click="incrementQuantity">+</el-button>
            </div>
          </el-form-item>
          <div class="form-actions">
            <el-button @click="navigateBack">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElForm } from 'element-plus';
import { categorySettingsApi, kitchenwareApi } from '../api';

const router = useRouter();
const formRef = ref<InstanceType<typeof ElForm>>();
const categories = ref<any[]>([]);

const form = reactive({
  name: '',
  type: '',
  quantity: 1
});

const rules = {
  name: [
    { required: true, message: '请输入厨具名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择厨具类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入厨具数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '数量不能为负数', trigger: 'blur' }
  ]
};

const fetchCategories = async () => {
  try {
    const response = await categorySettingsApi.getCategorySettings();
    categories.value = response.data.filter((item: any) => item.type === '厨具类型');
  } catch (error) {
    console.error('获取厨具类型失败:', error);
  }
};

const navigateBack = () => {
  router.push('/kitchenware');
};

const incrementQuantity = () => {
  form.quantity++;
};

const decrementQuantity = () => {
  if (form.quantity > 0) {
    form.quantity--;
  }
};

const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    await kitchenwareApi.createKitchenware({
      name: form.name,
      type: form.type,
      quantity: form.quantity
    });
    ElMessage.success('创建成功');
    router.push('/kitchenware');
  } catch (error) {
    console.error('创建厨具失败:', error);
    ElMessage.error('创建厨具失败');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.create-kitchenware {
  padding: 20px;
}

.kitchenware-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kitchenware-form {
  margin-top: 20px;
}

.quantity-input {
  display: flex;
  align-items: center;
  width: fit-content;
}

.quantity-input .el-button {
  width: 40px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>