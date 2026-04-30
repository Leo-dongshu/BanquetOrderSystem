<template>
  <div class="orders">
    <el-card class="orders-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="card-header-left">
            <el-icon class="header-icon"><List /></el-icon>
            <span class="header-title">订单信息管理</span>
          </div>
        </div>
      </template>
      <div class="orders-content">
        <div class="search-form">
          <el-form :inline="true" :model="searchForm" class="search-form-inner">
            <el-form-item label="订单编号">
              <el-input v-model="searchForm.order_number" placeholder="请输入订单编号" clearable />
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
              <el-input v-model="searchForm.customer_name" placeholder="请输入客户名称" clearable />
            </el-form-item>
            <el-form-item label="客户电话">
              <el-input v-model="searchForm.customer_phone" placeholder="请输入客户电话" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button @click="resetForm">
                <el-icon><RefreshRight /></el-icon>重置
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="showRecentDays" label="最近5天提醒" @change="handleRecentDaysChange" />
            </el-form-item>
          </el-form>
          <el-button type="primary" class="create-order-btn" @click="navigateTo('/orders/create')">
            <el-icon><Plus /></el-icon>创建订单
          </el-button>
        </div>
        <el-table :data="pagedOrders" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName" stripe>
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
          <el-table-column label="已优惠金额" min-width="100">
            <template #default="scope">
              {{ formatMoney(scope.row.discount_amount || 0) }}
            </template>
          </el-table-column>
          <el-table-column label="待回款金额" min-width="120">
            <template #default="scope">
              {{ formatMoney((scope.row.total_amount || 0) - (scope.row.deposit || 0) - (scope.row.paid_amount || 0) - (scope.row.discount_amount || 0)) }}
            </template>
          </el-table-column>
          <el-table-column prop="customer_name" label="客户名称" min-width="100" />
          <el-table-column prop="customer_phone" label="客户电话" min-width="120" />
          <el-table-column prop="booking_days" label="预定天数" min-width="80" />
          <el-table-column label="订单状态" min-width="100">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)" effect="dark" size="small" round>
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
              <el-button type="danger" size="small" :disabled="scope.row.status === -1 || scope.row.status === 9" @click="cancelOrder(scope.row)">退订</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { List, Search, RefreshRight, Plus } from '@element-plus/icons-vue';
import { useOrderStore } from '../store/order';
import { formatDate, formatMoney, getStatusType } from '../utils/dateFormat';
import { orderApi } from '../api';
import type { Order } from '../types';

const router = useRouter();
const orderStore = useOrderStore();

const orders = ref<Order[]>([]);
const loading = ref(false);
const showRecentDays = ref(true);
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

const total = computed(() => sortedOrders.value.length);

const isWithinRecentDays = (order: Order) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const feastDate = new Date(order.feast_time);
  const feastDay = new Date(feastDate.getFullYear(), feastDate.getMonth(), feastDate.getDate());
  const diffDays = (feastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < 5;
};

const sortedOrders = computed(() => {
  const allSorted = [...orders.value].sort((a, b) => {
    const timeA = a.feast_time ? new Date(a.feast_time).getTime() : 0;
    const timeB = b.feast_time ? new Date(b.feast_time).getTime() : 0;
    return timeB - timeA;
  });

  if (!showRecentDays.value) {
    return allSorted;
  }

  const recent = allSorted.filter(order => isWithinRecentDays(order));
  const others = allSorted.filter(order => !isWithinRecentDays(order));
  return [...recent, ...others];
});

const pagedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return sortedOrders.value.slice(startIndex, endIndex);
});

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

const handleRecentDaysChange = () => {
  currentPage.value = 1;
};

const tableRowClassName = ({ row }: { row: Order }) => {
  if (showRecentDays.value && isWithinRecentDays(row)) {
    return 'recent-days-row';
  }
  return '';
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

const cancelOrder = (row: any) => {
  ElMessageBox.confirm(
    `确定要退订订单 "${row.order_number}" 吗？退订后不可恢复。`,
    '退订确认',
    {
      confirmButtonText: '确定退订',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await orderApi.cancelOrder(row.id);
      ElMessage.success('订单退订成功');
      await handleSearch();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || '订单退订失败';
      ElMessage.error(errorMsg);
    }
  }).catch(() => {});
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: calc(100vh - 64px);
}

.orders-card {
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: box-shadow 0.3s ease;
}

.orders-card:hover {
  box-shadow: 0 6px 28px rgba(102, 126, 234, 0.12);
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  border-bottom: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.9);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
}

.orders-content {
  margin-top: 0;
}

.search-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.08);
  position: relative;
  overflow: hidden;
}

.search-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 0 0 4px;
}

.search-form-inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.search-form-inner .el-form-item {
  margin-bottom: 8px;
}

.search-form-inner :deep(.el-form-item__label) {
  color: #4a5568;
  font-weight: 500;
}

.search-form-inner :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-form-inner :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.3);
}

.search-form-inner :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #667eea inset;
}

.create-order-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 10px 22px !important;
  font-weight: 500 !important;
  letter-spacing: 1px;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
  transition: all 0.3s ease;
  margin-left: 16px;
  flex-shrink: 0;
}

.create-order-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45) !important;
  background: linear-gradient(135deg, #7b8ff0 0%, #8a5db8 100%) !important;
}

.create-order-btn:active {
  transform: translateY(0);
}

:deep(.el-table) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.el-table thead) {
  color: #4a5568;
  font-weight: 600;
}

:deep(.el-table th.el-table__cell) {
  background: linear-gradient(180deg, #f8f9ff 0%, #eef0fa 100%) !important;
  border-bottom: 2px solid rgba(102, 126, 234, 0.15) !important;
  padding: 14px 0;
}

:deep(.el-table td.el-table__cell) {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f5;
  transition: background-color 0.2s ease;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background: #fafbff;
}

:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: rgba(102, 126, 234, 0.04) !important;
}

:deep(.el-table .recent-days-row) {
  --el-table-tr-bg-color: #fff8e8;
}

:deep(.el-table .recent-days-row td.el-table__cell) {
  background: #fff8e8 !important;
}

:deep(.el-table .recent-days-row:hover > td.el-table__cell) {
  background: #fff0cc !important;
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

:deep(.el-tag--dark) {
  border-radius: 20px;
  padding: 0 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

:deep(.el-button--primary) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-button--danger) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-button--small) {
  border-radius: 6px;
  padding: 7px 15px;
}

.pagination-container {
  margin-top: 24px;
  padding: 16px 0 8px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f5;
}

:deep(.el-pagination) {
  gap: 8px;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next),
:deep(.el-pagination .el-pager li) {
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

:deep(.el-checkbox__label) {
  color: #4a5568;
  font-weight: 500;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #667eea;
  border-color: #667eea;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #667eea;
}

:deep(.el-loading-mask) {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.85);
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
</style>