<template>
  <div class="orders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
        </div>
      </template>
      <div class="orders-content">
        <div class="search-form" style="display: flex; align-items: center; justify-content: space-between;">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="订单编号">
              <el-input v-model="searchForm.order_number" placeholder="请输入订单编号" />
            </el-form-item>
            <el-form-item label="宴席时间">
              <el-date-picker
                v-model="searchForm.feast_time_range"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer_name" placeholder="请输入客户名称" />
            </el-form-item>
            <el-form-item label="客户电话">
              <el-input v-model="searchForm.customer_phone" placeholder="请输入客户电话" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form-item class="create-btn-item">
            <el-button type="primary" @click="navigateTo('/orders/create')">创建订单</el-button>
          </el-form-item>
        </div>
        <el-table :data="pagedOrders" style="width: 100%" v-loading="loading">
          <el-table-column prop="order_number" label="订单编号" min-width="180" />
          <el-table-column prop="formal_tables" label="正式桌" min-width="80" />
          <el-table-column prop="backup_tables" label="备用桌" min-width="80" />
          <el-table-column label="套餐标准" min-width="180">
            <template #default="scope">
              {{ scope.row.set_meal ? scope.row.set_meal.name : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="宴席时间" min-width="160">
            <template #default="scope">
              {{ formatDate(scope.row.feast_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="source" label="了解渠道" min-width="100" />
          <el-table-column prop="feast_type" label="酒席类型" min-width="100" />
          <el-table-column prop="total_amount" label="订单总价" min-width="100" />
          <el-table-column prop="deposit" label="预付定金" min-width="100" />
          <el-table-column label="已回款" min-width="100">
            <template #default="scope">
              {{ formatMoney(scope.row.paid_amount) }}
            </template>
          </el-table-column>
          <el-table-column label="待回款金额" min-width="120">
            <template #default="scope">
              {{ formatMoney((scope.row.total_amount || 0) - (scope.row.deposit || 0) - (scope.row.paid_amount || 0)) }}
            </template>
          </el-table-column>
          <el-table-column prop="customer_name" label="客户名称" min-width="100" />
          <el-table-column prop="customer_phone" label="客户电话" min-width="120" />
          <el-table-column prop="booking_days" label="预定天数" min-width="80" />
          <el-table-column label="订单状态" min-width="100">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)" effect="dark" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="详细地址" min-width="300">
            <template #default="scope">
              {{ scope.row.region }} {{ scope.row.service_address }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editOrder(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteOrder(scope.row.id)">删除</el-button>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useOrderStore } from '../store/order';
import { formatDate, formatMoney, getStatusType } from '../utils/dateFormat';
import { orderApi } from '../api';
import type { Order } from '../types';

const router = useRouter();
const orderStore = useOrderStore();

const orders = ref<Order[]>([]);
const loading = ref(false);
const searchForm = reactive({
  order_number: '',
  feast_time_range: [] as string[],
  customer_name: '',
  customer_phone: ''
});
const statusList = ref<any[]>([]);

// 获取订单状态列表
const fetchOrderStatuses = async () => {
  try {
    const res = await orderApi.getOrderStatuses();
    statusList.value = res.data || [];
  } catch (error) {
    console.error('获取订单状态列表失败:', error);
  }
};

// 获取状态文本
const getStatusText = (statusId: number) => {
  const status = statusList.value.find(s => s.id === statusId);
  return status ? status.name : '未知';
};

const getStatusTagType = (statusId: number) => {
  const status = statusList.value.find(s => s.id === statusId);
  return getStatusType(status?.name || '');
};

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);

onMounted(async () => {
  await fetchOrderStatuses();
  await handleSearch();
});

const total = computed(() => orders.value.length);

const pagedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return orders.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

const handleSearch = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    
    if (searchForm.order_number) {
      params.append('order_number', searchForm.order_number);
    }
    
    if (searchForm.feast_time_range && searchForm.feast_time_range.length === 2) {
      params.append('start_date', searchForm.feast_time_range[0]);
      params.append('end_date', searchForm.feast_time_range[1]);
    }
    
    if (searchForm.customer_name) {
      params.append('customer_name', searchForm.customer_name);
    }
    
    if (searchForm.customer_phone) {
      params.append('customer_phone', searchForm.customer_phone);
    }
    
    const response = await orderApi.getOrders(params.toString());
    orders.value = response.data;
    // 重置到第一页
    currentPage.value = 1;
  } catch (error) {
    console.error('搜索订单失败:', error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  searchForm.order_number = '';
  searchForm.feast_time_range = [];
  searchForm.customer_name = '';
  searchForm.customer_phone = '';
  handleSearch();
};

const navigateTo = (path: string) => {
  router.push(path);
};

const editOrder = (id: number) => {
  router.push(`/orders/edit/${id}`);
};

const deleteOrder = async (id: number) => {
  try {
    await orderStore.deleteOrder(id);
    // 删除订单后重新执行搜索，确保数据同步
    await handleSearch();
  } catch (error) {
    console.error(error);
  }
};

const updateOrderStatus = async (orderId: number, newStatus: number) => {
  try {
    // 只发送status字段，其他字段不发送
    await orderStore.updateOrder(orderId, {
      status: newStatus
    });
  } catch (error) {
    console.error('更新订单状态失败:', error);
  }
};

const handleStatusChange = async (row: any) => {
  try {
    await updateOrderStatus(row.id, row.status);
    ElMessage.success('订单状态更新成功');
  } catch (error) {
    console.error('更新订单状态失败:', error);
    ElMessage.error('更新订单状态失败');
  }
};
</script>

<style scoped>
.orders {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-content {
  margin-top: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.demo-form-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.demo-form-inline .el-form-item {
  margin-bottom: 10px;
}

.create-btn-item {
  margin-bottom: 10px;
}

.status-select-container .status-pending .el-select__input {
  color: #E6A23C !important;
}

.status-select-container .status-confirmed .el-select__input {
  color: #67C23A !important;
}

.status-select-container .status-arranged .el-select__input {
  color: #67C23A !important;
}

.status-select-container .status-cancelled .el-select__input {
  color: #F56C6C !important;
}

/* 直接状态类样式 */
.status-pending {
  color: #E6A23C !important;
}

.status-confirmed,
.status-arranged {
  color: #67C23A !important;
}

.status-cancelled {
  color: #F56C6C !important;
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