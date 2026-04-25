<template>
  <div class="kitchenware-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>厨具管理</span>
        </div>
      </template>
      <div class="kitchenware-content">
        <div class="search-container" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <el-select
            v-model="selectedType"
            placeholder="请选择厨具类型"
            style="width: 300px"
            @change="handleTypeChange"
          >
            <el-option label="全部" value="" />
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name" />
          </el-select>
          <el-button type="primary" @click="navigateTo('/kitchenware/create')">添加厨具</el-button>
        </div>
        <el-table :data="pagedKitchenwareList" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="厨具名称" min-width="120" />
          <el-table-column prop="type" label="厨具类型" min-width="120" />
          <el-table-column prop="quantity" label="数量" min-width="100" />
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
              <el-button type="primary" size="small" @click="editKitchenware(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteKitchenware(scope.row.id)">删除</el-button>
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate } from '../utils/dateFormat';
import { kitchenwareApi, categorySettingsApi } from '../api';

const router = useRouter();
const kitchenwareList = ref<any[]>([]);
const loading = ref(false);
const selectedType = ref('');
const categories = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

const filteredKitchenwareList = computed(() => {
  let result = kitchenwareList.value;
  if (selectedType.value) {
    result = result.filter(kitchenware => 
      kitchenware.type === selectedType.value
    );
  }
  return result;
});

const total = computed(() => filteredKitchenwareList.value.length);

const pagedKitchenwareList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredKitchenwareList.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

const handleTypeChange = () => {
  currentPage.value = 1;
};

const navigateTo = (path: string) => {
  router.push(path);
};

const editKitchenware = (id: number) => {
  router.push(`/kitchenware/edit/${id}`);
};

const deleteKitchenware = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个厨具吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await kitchenwareApi.deleteKitchenware(id);
    ElMessage.success('删除成功');
    fetchKitchenwareList();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除厨具失败:', error);
      ElMessage.error('删除厨具失败');
    }
  }
};

const fetchCategories = async () => {
  try {
    const response = await categorySettingsApi.getCategorySettings();
    categories.value = response.data.filter((item: any) => item.type === '厨具类型');
  } catch (error) {
    console.error('获取厨具类型失败:', error);
  }
};

const fetchKitchenwareList = async () => {
  loading.value = true;
  try {
    const response = await kitchenwareApi.getKitchenwares();
    kitchenwareList.value = response.data;
  } catch (error) {
    console.error('获取厨具列表失败:', error);
    ElMessage.error('获取厨具列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
  fetchKitchenwareList();
});
</script>

<style scoped>
.kitchenware-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kitchenware-content {
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