<template>
  <div class="staff-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>人员管理</span>
        </div>
      </template>
      <div class="staff-content">
        <el-button type="primary" class="add-staff-btn" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          <span>添加人员</span>
        </el-button>
        <el-table :data="pagedStaffList" style="width: 100%">
          <!-- 隐藏id列 -->
          <el-table-column prop="id" label="ID" width="80" v-if="false" />
          <el-table-column prop="name" label="人员名称" />
          <el-table-column prop="gender" label="性别" />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="phone" label="手机号码" />
          <el-table-column prop="position" label="职位" />
          <el-table-column prop="positionType" label="职位类型" />
          <el-table-column prop="created_at" label="登记时间" width="180">
            <template #default="scope">
              {{ scope.row.created_at ? formatDate(scope.row.created_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editStaff(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteStaff(scope.row.id)">删除</el-button>
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

    <!-- 添加人员对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加人员"
      width="500px"
    >
      <el-form :model="staffForm" label-width="100px">
        <el-form-item label="人员名称" required>
          <el-input v-model="staffForm.name" placeholder="请输入人员名称" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-select v-model="staffForm.gender" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" required>
          <el-input v-model.number="staffForm.age" type="number" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="手机号码" required>
          <el-input v-model="staffForm.phone" placeholder="请输入手机号码" />
          <template #error>
            <div v-if="!validatePhone(staffForm.phone)">请输入有效的手机号码</div>
          </template>
        </el-form-item>
        <el-form-item label="职位类型" required>
          <el-select v-model="staffForm.positionType" placeholder="请选择职位类型">
            <el-option v-for="item in positionTypes" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required>
          <el-select v-model="staffForm.position" placeholder="请选择职位">
            <el-option v-for="item in staffTypes" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button type="primary" @click="addStaff">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { categorySettingsApi, staffApi } from '../../api';
import { formatDate } from '../../utils/dateFormat';
import { ElMessage } from 'element-plus';

// 人员数据
const staffList = ref([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => staffList.value.length);
const pagedStaffList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return staffList.value.slice(startIndex, endIndex);
});

// 响应式数据
const showAddDialog = ref(false);
const staffForm = ref({
  name: '',
  gender: '',
  age: '',
  phone: '',
  positionType: '',
  position: ''
});

// 类别数据
const staffTypes = ref<any[]>([]); // 人员类型
const positionTypes = ref<any[]>([]); // 职位类型

// 获取类别设置数据
const fetchCategorySettings = async () => {
  try {
    const response = await categorySettingsApi.getCategorySettings();
    const categories = response.data;
    // console.log('类别设置数据:', categories);
    
    // 过滤出人员类型和职位类型
    const staffTypeData = categories.filter((item: any) => item.type === '人员类型');
    const positionTypeData = categories.filter((item: any) => item.type === '职位类型');
    
    // console.log('人员类型:', staffTypeData);
    // console.log('职位类型:', positionTypeData);
    
    // 更新数据
    positionTypes.value = positionTypeData;
    staffTypes.value = staffTypeData;
    
    // console.log('更新职位类型数据:', positionTypes.value);
    // console.log('更新人员类型数据:', staffTypes.value);
  } catch (error) {
    console.error('获取类别设置失败:', error);
    ElMessage.error('获取类别设置失败');
  }
};

// 获取人员列表
const fetchStaffList = async () => {
  try {
    const response = await staffApi.getStaffList();
    staffList.value = response.data;
    // console.log('获取人员列表成功:', staffList.value);
  } catch (error) {
    console.error('获取人员列表失败:', error);
    ElMessage.error('获取人员列表失败');
  }
};

// 生命周期钩子
onMounted(() => {
  // console.log('=== 人员管理组件已挂载 ===');
  // console.log('开始获取类别设置数据...');
  fetchCategorySettings().then(() => {
    // console.log('=== 获取类别设置数据完成 ===');
    // console.log('职位类型数量：', positionTypes.value.length);
    // console.log('职位类型数据：', positionTypes.value);
    // console.log('人员类型数量：', staffTypes.value.length);
    // console.log('人员类型数据：', staffTypes.value);
    // 获取人员列表
    fetchStaffList();
  }).catch((error) => {
    console.error('获取类别设置数据失败：', error);
  });
});

// 添加人员
const addStaff = async () => {
  // 表单验证
  if (!staffForm.value.name || !staffForm.value.gender || !staffForm.value.age || !staffForm.value.phone || !staffForm.value.position || !staffForm.value.positionType) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  
  // 手机号校验
  if (!validatePhone(staffForm.value.phone)) {
    ElMessage.warning('请输入有效的手机号码');
    return;
  }
  
  try {
    // 调用API添加人员
    const response = await staffApi.createStaff({
      ...staffForm.value,
      age: Number(staffForm.value.age), // 将年龄转换为数字
      registrationTime: new Date().toISOString().split('T')[0] // 使用当前日期作为登记时间
    });
    // console.log('添加人员成功:', response.data);
    // 更新人员列表
    await fetchStaffList();
    ElMessage.success('添加人员成功');
    closeAddDialog();
  } catch (error) {
    console.error('添加人员失败:', error);
    ElMessage.error('添加人员失败');
  }
};

// 手机号校验
const validatePhone = (phone: string) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 关闭添加对话框
const closeAddDialog = () => {
  showAddDialog.value = false;
  // 重置表单
  staffForm.value = {
    name: '',
    gender: '',
    age: '',
    phone: '',
    positionType: '',
    position: ''
  };
};

// 编辑人员
const editStaff = (staff: any) => {
  // console.log('编辑人员:', staff);
  // 这里可以添加编辑人员的逻辑,例如打开编辑对话框
};

// 删除人员
const deleteStaff = async (id: number) => {
  try {
    await staffApi.deleteStaff(id);
    // console.log('删除人员成功:', id);
    // 更新人员列表
    await fetchStaffList();
    // 如果删除后当前页没有数据，且不是第一页，则跳转到上一页
    if (pagedStaffList.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    ElMessage.success('删除人员成功');
  } catch (error) {
    console.error('删除人员失败:', error);
    ElMessage.error('删除人员失败');
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
.staff-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.staff-content {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.add-staff-btn {
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