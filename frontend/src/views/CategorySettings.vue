<template>
  <div class="category-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>类别设置</span>
        </div>
      </template>
      <div class="category-settings-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="类别管理" name="categories">
            <div class="filter-section">
              <el-select v-model="filterType" placeholder="按类别类型筛选" style="width: 200px" @change="handleTypeChange">
                <el-option label="全部" value="" />
                <el-option v-for="type in categoryTypes" :key="type.id" :label="type.name" :value="type.name" />
              </el-select>
              <el-input
                v-model="searchQuery"
                placeholder="请输入类别名称"
                prefix-icon="el-icon-search"
                style="width: 300px; margin-left: 20px"
                @input="handleSearch"
              />
              <el-button type="primary" style="margin-left: auto" @click="showDialog = true">新增类别</el-button>
            </div>
            <el-table :data="pagedCategories" style="width: 100%" v-loading="loading">
              <el-table-column prop="type" label="类别类型" min-width="120">
                <template #default="scope">
                  {{ getTypeName(scope.row.type) }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="类别名称" min-width="150" />
              <el-table-column prop="createdBy" label="创建人" min-width="100" />
              <el-table-column label="创建时间" min-width="160">
                <template #default="scope">
                  {{ formatDate(scope.row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column prop="updatedBy" label="修改人" min-width="100" />
              <el-table-column label="修改时间" min-width="160">
                <template #default="scope">
                  {{ formatDate(scope.row.updated_at) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editCategory(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteCategory(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="类型管理" name="types">
            <div style="margin-bottom: 20px; display: flex; justify-content: flex-end">
              <el-button type="primary" @click="showTypeDialog = true">新增类型</el-button>
            </div>
            <el-table :data="pagedCategoryTypes" style="width: 100%" v-loading="typeLoading">
              <el-table-column prop="name" label="类型名称" min-width="150" />
              <el-table-column prop="createdBy" label="创建人" min-width="100" />
              <el-table-column label="创建时间" min-width="160">
                <template #default="scope">
                  {{ formatDate(scope.row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column prop="updatedBy" label="修改人" min-width="100" />
              <el-table-column label="修改时间" min-width="160">
                <template #default="scope">
                  {{ formatDate(scope.row.updated_at) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="editType(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteType(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="totalTypes > 0">
              <el-pagination
                @size-change="handleTypeSizeChange"
                @current-change="handleTypeCurrentChange"
                :current-page="currentPageType"
                :page-sizes="[10, 15, 20, 50]"
                :page-size="pageSizeType"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalTypes"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        
        <div class="pagination-container" v-if="activeTab === 'categories' && total > 0">
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

    <!-- 新增/编辑类别对话框 -->
    <el-dialog
      v-model="showDialog"
      :title="isEditing ? '编辑类别' : '新增类别'"
      width="500px"
    >
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="类别类型" required>
          <el-select v-model="categoryForm.type" placeholder="请选择类别类型" :disabled="isEditing">
            <el-option v-for="type in categoryTypes" :key="type.id" :label="type.name" :value="type.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称" required>
          <el-input v-model="categoryForm.name" placeholder="请输入类别名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitCategory">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增/编辑类别类型对话框 -->
    <el-dialog
      v-model="showTypeDialog"
      :title="isEditingType ? '编辑类别' : '新增类别'"
      width="500px"
    >
      <el-form :model="typeForm" label-width="100px">
        <el-form-item label="类型名称" required>
          <el-input v-model="typeForm.name" placeholder="请输入类型名称（如：用餐类型）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTypeDialog">取消</el-button>
          <el-button type="primary" @click="submitType">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { categorySettingsApi, categoryTypeApi } from '../api';
import { formatDate } from '../utils/dateFormat';
import { ElMessage, ElMessageBox } from 'element-plus';

interface CategorySettings {
  id: number;
  type: string;
  name: string;
  created_by: number;
  createdBy?: string;
  created_at: string;
  updated_by: number;
  updatedBy?: string;
  updated_at: string;
}

interface CategoryType {
  id: number;
  name: string;
  createdBy?: string;
  created_at: string;
  updatedBy?: string;
  updated_at: string;
}

const activeTab = ref('categories');
const loading = ref(false);
const typeLoading = ref(false);
const showDialog = ref(false);
const showTypeDialog = ref(false);
const isEditing = ref(false);
const isEditingType = ref(false);
const searchQuery = ref('');
const filterType = ref('');

const currentPage = ref(1);
const pageSize = ref(15);
const currentPageType = ref(1);
const pageSizeType = ref(15);

const categories = ref<CategorySettings[]>([]);
const categoryTypes = ref<CategoryType[]>([]);

const categoryForm = reactive({
  id: 0,
  type: '',
  name: ''
});

const typeForm = reactive({
  id: 0,
  name: ''
});

const getTypeName = (name: string) => {
  const type = categoryTypes.value.find(t => t.name === name);
  return type ? type.name : name;
};

const fetchCategories = async () => {
  try {
    loading.value = true;
    const res = await categorySettingsApi.getCategorySettings();
    categories.value = res.data;
  } catch (error) {
    console.error('获取类别设置失败:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCategoryTypes = async () => {
  try {
    typeLoading.value = true;
    const res = await categoryTypeApi.getCategoryTypes();
    categoryTypes.value = res.data;
  } catch (error) {
    console.error('获取类别类型失败:', error);
  } finally {
    typeLoading.value = false;
  }
};

onMounted(() => {
  fetchCategoryTypes().then(() => {
    fetchCategories();
  });
});

const filteredCategories = computed(() => {
  let result = categories.value;
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value);
  }
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return result;
});

const total = computed(() => filteredCategories.value.length);

const pagedCategories = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredCategories.value.slice(startIndex, endIndex);
});

const totalTypes = computed(() => categoryTypes.value.length);

const pagedCategoryTypes = computed(() => {
  const startIndex = (currentPageType.value - 1) * pageSizeType.value;
  const endIndex = startIndex + pageSizeType.value;
  return categoryTypes.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

const handleTypeSizeChange = (size: number) => {
  pageSizeType.value = size;
  currentPageType.value = 1;
};

const handleTypeCurrentChange = (current: number) => {
  currentPageType.value = current;
};

const handleTypeChange = () => {
  currentPage.value = 1;
};

const handleSearch = () => {
  currentPage.value = 1;
};

const editCategory = (category: CategorySettings) => {
  isEditing.value = true;
  categoryForm.id = category.id;
  categoryForm.type = category.type;
  categoryForm.name = category.name;
  showDialog.value = true;
};

const deleteCategory = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该类别吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await categorySettingsApi.deleteCategorySetting(id);
    await fetchCategories();
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除类别失败:', error);
    }
  }
};

const closeDialog = () => {
  showDialog.value = false;
  categoryForm.id = 0;
  categoryForm.type = '';
  categoryForm.name = '';
  isEditing.value = false;
};

const submitCategory = async () => {
  if (!categoryForm.type || !categoryForm.name) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  
  try {
    if (isEditing.value) {
      await categorySettingsApi.updateCategorySetting(categoryForm.id, {
        type: categoryForm.type,
        name: categoryForm.name
      });
      ElMessage.success('更新成功');
    } else {
      await categorySettingsApi.createCategorySetting({
        type: categoryForm.type,
        name: categoryForm.name
      });
      ElMessage.success('创建成功');
    }
    await fetchCategories();
    closeDialog();
  } catch (error) {
    console.error('保存类别失败:', error);
  }
};

const editType = (type: CategoryType) => {
  isEditingType.value = true;
  typeForm.id = type.id;
  typeForm.name = type.name;
  showTypeDialog.value = true;
};

const deleteType = async (id: number) => {
  try {
    await ElMessageBox.confirm('删除类型将同时删除该类型下的所有类别，确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await categoryTypeApi.deleteCategoryType(id);
    await fetchCategoryTypes();
    await fetchCategories();
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除类型失败:', error);
    }
  }
};

const closeTypeDialog = () => {
  showTypeDialog.value = false;
  typeForm.id = 0;
  typeForm.name = '';
  isEditingType.value = false;
};

const submitType = async () => {
  if (!typeForm.name) {
    ElMessage.warning('请填写类型名称');
    return;
  }
  
  try {
    if (isEditingType.value) {
      await categoryTypeApi.updateCategoryType(typeForm.id, {
        name: typeForm.name
      });
      ElMessage.success('更新成功');
    } else {
      await categoryTypeApi.createCategoryType({
        name: typeForm.name
      });
      ElMessage.success('创建成功');
    }
    await fetchCategoryTypes();
    closeTypeDialog();
  } catch (error) {
    console.error('保存类型失败:', error);
  }
};
</script>

<style scoped>
.category-settings {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-settings-content {
  margin-top: 20px;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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