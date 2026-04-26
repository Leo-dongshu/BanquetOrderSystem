<template>
  <div class="vehicle-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车辆管理</span>
        </div>
      </template>
      <div class="vehicle-content">
        <el-button type="primary" class="add-vehicle-btn" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          <span>添加车辆</span>
        </el-button>
        <el-table :data="pagedVehicleList" style="width: 100%" v-loading="loading">
          <!-- 隐藏id列 -->
          <el-table-column prop="id" label="ID" width="80" v-if="false" />
          <el-table-column prop="plateNumber" label="车牌号" />
          <el-table-column prop="type" label="车辆类型" />
          <el-table-column prop="brand" label="车辆颜色" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editVehicle(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteVehicle(scope.row.id)">删除</el-button>
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

    <!-- 添加/编辑车辆对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择车辆类型">
            <el-option
              v-for="item in vehicleTypes"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-input v-model="form.brand" placeholder="请输入车辆颜色" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="可用" value="可用" />
            <el-option label="维修中" value="维修中" />
            <el-option label="已报废" value="已报废" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveVehicle" :loading="saving">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="300px"
    >
      <span>确定要删除此车辆吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="deleting">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../store/auth';

// 车辆数据
const vehicleList = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => vehicleList.value.length);
const pagedVehicleList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return vehicleList.value.slice(startIndex, endIndex);
});

// 车辆类型选项
const vehicleTypes = ref([
  { id: 1, name: '轿车' },
  { id: 2, name: '货车' },
  { id: 3, name: '面包车' }
]);

// 加载状态
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

// 对话框状态
const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogTitle = ref('添加车辆');

// 表单数据
const form = reactive({
  id: 0,
  plateNumber: '',
  type: '',
  brand: '',
  status: ''
});

// 表单引用
const formRef = ref();

// 表单验证规则
const rules = reactive({
  plateNumber: [
    { required: true, message: '请输入车牌号', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择车辆类型', trigger: 'change' }
  ]
});

// 待删除的车辆ID
const deletingId = ref(0);

// 初始化auth store
const authStore = useAuthStore();

// API基础URL
const API_BASE_URL = '/api';

// 获取车辆列表
const fetchVehicles = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (!response.ok) {
      throw new Error('获取车辆列表失败');
    }
    const data = await response.json();
    vehicleList.value = data;
  } catch (error) {
    console.error('获取车辆列表失败:', error);
    ElMessage.error('获取车辆列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取车辆类型数据
const fetchVehicleTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/category-settings?type=车辆类型`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (!response.ok) {
      throw new Error('获取车辆类型数据失败');
    }
    const data = await response.json();
    vehicleTypes.value = data;
  } catch (error) {
    console.error('获取车辆类型数据失败:', error);
    ElMessage.error('获取车辆类型数据失败');
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchVehicles();
  fetchVehicleTypes();
});

// 显示添加对话框
const showAddDialog = () => {
  dialogTitle.value = '添加车辆';
  // 重置表单
  form.id = 0;
  form.plateNumber = '';
  form.type = '';
  form.brand = '';
  form.status = '';
  dialogVisible.value = true;
};

// 编辑车辆
const editVehicle = (vehicle: any) => {
  dialogTitle.value = '编辑车辆';
  // 填充表单数据
  form.id = vehicle.id;
  form.plateNumber = vehicle.plateNumber;
  form.type = vehicle.type;
  form.brand = vehicle.brand;
  form.status = vehicle.status;
  dialogVisible.value = true;
};

// 保存车辆
const saveVehicle = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    saving.value = true;
    
    // 获取当前登录用户的用户名
    const currentUsername = authStore.user?.username || 'admin';
    
    if (form.id === 0) {
      // 添加新车辆
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          plateNumber: form.plateNumber,
          type: form.type,
          brand: form.brand,
          status: form.status,
          createdBy: currentUsername,
          updatedBy: currentUsername
        })
      });
      
      if (!response.ok) {
        throw new Error('添加车辆失败');
      }
      
      ElMessage.success('添加车辆成功');
    } else {
      // 编辑现有车辆
      const response = await fetch(`${API_BASE_URL}/vehicles/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          plateNumber: form.plateNumber,
          type: form.type,
          brand: form.brand,
          status: form.status,
          updatedBy: currentUsername
        })
      });
      
      if (!response.ok) {
        throw new Error('更新车辆失败');
      }
      
      ElMessage.success('更新车辆成功');
    }
    
    dialogVisible.value = false;
    // 重新获取车辆列表
    await fetchVehicles();
  } catch (error) {
    console.error('保存车辆失败:', error);
    ElMessage.error('保存车辆失败');
  } finally {
    saving.value = false;
  }
};

// 显示删除确认对话框
const deleteVehicle = (id: number) => {
  deletingId.value = id;
  deleteDialogVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  try {
    deleting.value = true;
    
    const response = await fetch(`${API_BASE_URL}/vehicles/${deletingId.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('删除车辆失败');
    }
    
    ElMessage.success('删除车辆成功');
    deleteDialogVisible.value = false;
    // 重新获取车辆列表
    await fetchVehicles();
    // 如果删除后当前页没有数据，且不是第一页，则跳转到上一页
    if (pagedVehicleList.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error('删除车辆失败:', error);
    ElMessage.error('删除车辆失败');
  } finally {
    deleting.value = false;
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
.vehicle-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-content {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.add-vehicle-btn {
  margin-bottom: 20px;
}

:deep(.el-table th),
:deep(.el-table td) {
  text-align: center !important;
  vertical-align: middle !important;
}

:deep(.el-table th .cell),
:deep(.el-table td .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
}
</style>