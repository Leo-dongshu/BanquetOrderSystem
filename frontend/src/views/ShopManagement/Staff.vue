<template>
  <div class="staff-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>人员管理</span>
        </div>
      </template>
      <div class="staff-content">
        <el-button type="primary" class="add-staff-btn" @click="showAddDialogFn">
          <el-icon><Plus /></el-icon>
          <span>添加人员</span>
        </el-button>
        <el-table :data="pagedStaffList" style="width: 100%">
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="人员名称" required>
          <el-input v-model="form.name" placeholder="请输入人员名称" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" required>
          <el-input v-model.number="form.age" type="number" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="手机号码" required>
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="职位类型" required>
          <el-select v-model="form.positionType" placeholder="请选择职位类型">
            <el-option v-for="item in positionTypes" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required>
          <el-select v-model="form.position" placeholder="请选择职位">
            <el-option v-for="item in staffTypes" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveStaff" :loading="saving">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="400px"
    >
      <span>确定要删除此人员吗？删除后不可恢复。</span>
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
import { categorySettingsApi, staffApi } from '../../api';
import { formatDate } from '../../utils/dateFormat';
import { ElMessage } from 'element-plus';

const staffList = ref([]);

const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => staffList.value.length);
const pagedStaffList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return staffList.value.slice(startIndex, endIndex);
});

const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogTitle = ref('添加人员');
const saving = ref(false);
const deleting = ref(false);
const deletingId = ref(0);

const form = reactive({
  id: 0,
  name: '',
  gender: '',
  age: '' as string | number,
  phone: '',
  positionType: '',
  position: ''
});

const staffTypes = ref<any[]>([]);
const positionTypes = ref<any[]>([]);

const fetchCategorySettings = async () => {
  try {
    const response = await categorySettingsApi.getCategorySettings();
    const categories = response.data;
    const staffTypeData = categories.filter((item: any) => item.type === '人员类型');
    const positionTypeData = categories.filter((item: any) => item.type === '职位类型');
    positionTypes.value = positionTypeData;
    staffTypes.value = staffTypeData;
  } catch (error) {
    console.error('获取类别设置失败:', error);
    ElMessage.error('获取类别设置失败');
  }
};

const fetchStaffList = async () => {
  try {
    const response = await staffApi.getStaffList();
    staffList.value = response.data;
  } catch (error) {
    console.error('获取人员列表失败:', error);
    ElMessage.error('获取人员列表失败');
  }
};

onMounted(() => {
  fetchCategorySettings().then(() => {
    fetchStaffList();
  }).catch((error) => {
    console.error('获取类别设置数据失败：', error);
  });
});

const validatePhone = (phone: string) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const resetForm = () => {
  form.id = 0;
  form.name = '';
  form.gender = '';
  form.age = '';
  form.phone = '';
  form.positionType = '';
  form.position = '';
};

const showAddDialogFn = () => {
  dialogTitle.value = '添加人员';
  resetForm();
  dialogVisible.value = true;
};

const editStaff = (staff: any) => {
  dialogTitle.value = '编辑人员';
  form.id = staff.id;
  form.name = staff.name;
  form.gender = staff.gender;
  form.age = staff.age;
  form.phone = staff.phone;
  form.positionType = staff.positionType;
  form.position = staff.position;
  dialogVisible.value = true;
};

const saveStaff = async () => {
  if (!form.name || !form.gender || !form.age || !form.phone || !form.position || !form.positionType) {
    ElMessage.warning('请填写完整信息');
    return;
  }

  if (!validatePhone(form.phone)) {
    ElMessage.warning('请输入有效的手机号码');
    return;
  }

  try {
    saving.value = true;

    if (form.id === 0) {
      await staffApi.createStaff({
        name: form.name,
        gender: form.gender,
        age: Number(form.age),
        phone: form.phone,
        position: form.position,
        positionType: form.positionType,
        registrationTime: new Date().toISOString().split('T')[0]
      });
      ElMessage.success('添加人员成功');
    } else {
      await staffApi.updateStaff(form.id, {
        name: form.name,
        gender: form.gender,
        age: Number(form.age),
        phone: form.phone,
        position: form.position,
        positionType: form.positionType,
        registrationTime: new Date().toISOString().split('T')[0]
      });
      ElMessage.success('更新人员成功');
    }

    dialogVisible.value = false;
    await fetchStaffList();
  } catch (error) {
    console.error('保存人员失败:', error);
    ElMessage.error(form.id === 0 ? '添加人员失败' : '更新人员失败');
  } finally {
    saving.value = false;
  }
};

const deleteStaff = (id: number) => {
  deletingId.value = id;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    deleting.value = true;
    await staffApi.deleteStaff(deletingId.value);
    ElMessage.success('删除人员成功');
    deleteDialogVisible.value = false;
    await fetchStaffList();
    if (pagedStaffList.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error: any) {
    console.error('删除人员失败:', error);
    const errorMsg = error?.response?.data?.error || '删除人员失败';
    ElMessage.error(errorMsg);
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
