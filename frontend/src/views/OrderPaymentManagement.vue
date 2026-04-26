<template>
  <div class="orders">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单回款管理</span>
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
        </div>
        <el-table :data="pagedOrders" style="width: 100%">
          <el-table-column prop="order_number" label="订单编号" min-width="180" align="center" />
          <el-table-column prop="formal_tables" label="正式桌" min-width="80" align="center" />
          <el-table-column prop="backup_tables" label="备用桌" min-width="80" align="center" />
          <el-table-column label="套餐标准" min-width="180" align="center">
            <template #default="scope">
              {{ scope.row.set_meal ? scope.row.set_meal.name : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="宴席时间" min-width="160" align="center">
            <template #default="scope">
              {{ formatDate(scope.row.feast_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="source" label="了解渠道" min-width="100" align="center" />
          <el-table-column prop="feast_type" label="酒席类型" min-width="100" align="center" />
          <el-table-column prop="total_amount" label="订单总价" min-width="100" align="center" />
          <el-table-column prop="deposit" label="预付定金" min-width="100" align="center" />
          <el-table-column label="已回款金额" min-width="100" align="center">
            <template #default="scope">
              {{ formatMoney(scope.row.paid_amount) }}
            </template>
          </el-table-column>
          <el-table-column label="已优惠金额" min-width="100" align="center">
            <template #default="scope">
              {{ formatMoney(scope.row.discount_amount || 0) }}
            </template>
          </el-table-column>
          <el-table-column label="待回款金额" min-width="120" align="center">
            <template #default="scope">
              {{ formatMoney((scope.row.total_amount || 0) - (scope.row.deposit || 0) - (scope.row.paid_amount || 0) - (scope.row.discount_amount || 0)) }}
            </template>
          </el-table-column>
          <el-table-column prop="customer_name" label="客户名称" min-width="100" align="center" />
          <el-table-column prop="customer_phone" label="客户电话" min-width="120" align="center" />
          <el-table-column label="订单状态" min-width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)" effect="dark" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="booking_days" label="预定天数" min-width="80" align="center" />
          <el-table-column label="详细地址" min-width="300" align="center">
            <template #default="scope">
              {{ scope.row.region }} {{ scope.row.service_address }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                :disabled="scope.row.status === 9"
                @click="handlePayment(scope.row.id)"
              >
                {{ scope.row.status === 9 ? '已回款' : '确认回款' }}
              </el-button>
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

    <!-- 回款对话框 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="回款确认"
      width="500px"
      custom-class="payment-dialog"
      :close-on-click-modal="false"
    >
      <div class="payment-dialog-content">
        <div class="payment-info">
          <div class="info-header">
            <el-icon><InfoFilled /></el-icon>
            <span>订单回款信息</span>
          </div>
          <div class="payment-summary">
            <div class="summary-row">
              <div class="summary-item">
                <span class="label">订单金额</span>
                <span class="value">¥{{ formatMoney(paymentForm.total_amount) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">已付定金</span>
                <span class="value highlight">¥{{ formatMoney(paymentForm.deposit) }}</span>
              </div>
            </div>
            <div class="summary-row">
              <div class="summary-item">
                <span class="label">已回款</span>
                <span class="value highlight">¥{{ formatMoney(paymentForm.paid_amount) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">应收金额</span>
                <span class="value primary">¥{{ receivableAmount }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="payment-input-section">
          <div class="input-group">
            <label>
              <el-icon><Money /></el-icon>
              实收金额
            </label>
            <div class="amount-input">
              <el-input 
                v-model.number="paymentForm.payment_amount" 
                class="amount-input-field" 
                placeholder="请输入实收金额"
              />
              <span class="amount-unit">元</span>
            </div>
          </div>
          
          <div class="input-group">
            <label>
              <el-icon><Discount /></el-icon>
              优惠金额
            </label>
            <div class="amount-input">
              <el-input 
                v-model.number="paymentForm.discount_amount" 
                class="amount-input-field" 
                placeholder="请输入优惠金额"
              />
              <span class="amount-unit">元</span>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="paymentDialogVisible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button type="primary" class="confirm-btn" @click="submitPayment">
            <el-icon><Check /></el-icon>
            确认回款
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { InfoFilled, Money, Discount, Close, Check } from '@element-plus/icons-vue';
import { orderApi } from '../api';
import { formatMoney, getStatusType } from '../utils/dateFormat';

// 搜索表单
const searchForm = reactive({
  order_number: '',
  feast_time_range: [] as string[],
  customer_name: '',
  customer_phone: ''
});

// 订单列表
const orders = ref<any[]>([]);
const statusList = ref<any[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => orders.value.length);
const pagedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return orders.value.slice(startIndex, endIndex);
});

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

// 获取状态类型（用于el-tag颜色）
const getStatusTagType = (statusId: number) => {
  const status = statusList.value.find(s => s.id === statusId);
  return getStatusType(status?.name || '');
};

// 回款对话框
const paymentDialogVisible = ref(false);
const paymentForm = ref({
  order_id: 0,
  order_number: '',
  customer_name: '',
  total_amount: 0,
  deposit: 0,
  paid_amount: 0,
  payment_amount: 0,
  discount_amount: 0,
  payment_date: new Date(),
  payment_method: '',
  remark: ''
});

// 计算应收金额（订单总金额 - 已付定金 - 已回款 - 优惠金额）
const receivableAmount = computed(() => {
  const total = paymentForm.value.total_amount || 0;
  const deposit = paymentForm.value.deposit || 0;
  const paid = paymentForm.value.paid_amount || 0;
  const discount = paymentForm.value.discount_amount || 0;
  return (total - deposit - paid - discount).toFixed(2);
});

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
};

// 搜索订单
const handleSearch = async () => {
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
    orders.value = response.data || [];
    currentPage.value = 1;
  } catch (error) {
    console.error('搜索订单失败:', error);
    ElMessage.error('搜索订单失败');
  }
};

// 重置搜索
const resetForm = () => {
  searchForm.order_number = '';
  searchForm.feast_time_range = [];
  searchForm.customer_name = '';
  searchForm.customer_phone = '';
  handleSearch();
};

// 处理回款
const handlePayment = (orderId: number) => {
  const order = orders.value.find(o => o.id === orderId);
  if (order) {
    const total = order.total_amount || 0;
    const deposit = order.deposit || 0;
    const paid = order.paid_amount || 0;
    const discount = order.discount_amount || 0;
    paymentForm.value = {
      order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      total_amount: order.total_amount,
      deposit: order.deposit,
      paid_amount: order.paid_amount || 0,
      discount_amount: order.discount_amount || 0,
      payment_amount: total - deposit - paid - discount,
      payment_date: new Date(),
      payment_method: order.payment_method || '',
      remark: ''
    };
    paymentDialogVisible.value = true;
  }
};

// 提交回款
const submitPayment = async () => {
  try {
    await orderApi.confirmPayment(paymentForm.value.order_id, {
      payment_amount: paymentForm.value.payment_amount,
      discount_amount: paymentForm.value.discount_amount || 0
    });
    ElMessage.success('回款成功');
    paymentDialogVisible.value = false;
    handleSearch();
  } catch (error) {
    console.error('回款失败:', error);
    ElMessage.error('回款失败');
  }
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

// 初始加载
onMounted(() => {
  fetchOrderStatuses();
  handleSearch();
});
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

/* 回款对话框样式 */
.payment-dialog {
  background-color: #ffffff;
  color: #303133;
  border-radius: 12px;
  overflow: hidden;
}

.payment-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 18px 24px;
  border-bottom: none;
}

.payment-dialog .el-dialog__title {
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
}

.payment-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}

.payment-dialog .el-dialog__body {
  padding: 0;
  background-color: #fafbfc;
}

.payment-dialog-content {
  padding: 24px;
}

.payment-dialog .el-dialog__footer {
  background-color: #ffffff;
  border-top: 1px solid #ebeef5;
  padding: 16px 24px;
}

.payment-info {
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f4ff 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #d9ecff;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.info-header .el-icon {
  font-size: 18px;
}

.payment-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.summary-item .label {
  font-size: 12px;
  color: #909399;
}

.summary-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.summary-item .value.highlight {
  color: #e6a23c;
}

.summary-item .value.primary {
  color: #409eff;
}

.payment-input-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #ebeef5;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  min-width: 72px;
}

.input-group label .el-icon {
  color: #667eea;
}

.amount-input {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 280px;
}

.amount-input-field {
  flex: 1;
}

.amount-input-field :deep(.el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  padding: 4px 12px;
  transition: all 0.3s;
}

.amount-input-field :deep(.el-input__wrapper:hover) {
  border-color: #b4bccc;
}

.amount-input-field :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.amount-input-field :deep(.el-input__inner) {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.amount-unit {
  color: #909399;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .cancel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  color: #606266;
  font-weight: 500;
  transition: all 0.3s;
}

.dialog-footer .cancel-btn:hover {
  border-color: #c0c4cc;
  background-color: #f5f7fa;
}

.dialog-footer .confirm-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.dialog-footer .confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>