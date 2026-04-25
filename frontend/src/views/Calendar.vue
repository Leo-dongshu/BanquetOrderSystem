<template>
  <div class="calendar">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单日历</span>
        </div>
      </template>
      <div class="calendar-content">
        <el-calendar v-model="currentDate" :locale="locale">
          <template #dateCell="{ date, data }">
            <div class="calendar-cell" :class="{ 'has-orders': hasOrders(date) }">
  <div class="date-container">
    <span class="date">{{ data.day }}</span>
    <div class="order-counts" v-if="hasOrders(date)">
      <span class="confirmed-count" v-if="getConfirmedOrdersCount(date) > 0">已确认: {{ getConfirmedOrdersCount(date) }}</span>
      <span class="pending-count" v-if="getPendingOrdersCount(date) > 0">未确认: {{ getPendingOrdersCount(date) }}</span>
    </div>
  </div>
  <div class="orders" v-if="hasOrders(date)">
    <div class="order-item" v-for="order in getOrdersByDate(date)" :key="order.id">
      <el-tooltip :content="`${order.customer_name}: ${order.table_count}桌`" placement="top">
        <span class="order-customer">{{ order.customer_name }}</span>
      </el-tooltip>
    </div>
  </div>
</div>
          </template>
        </el-calendar>
        <div class="selected-date-orders" v-if="selectedDateOrders.length > 0">
          <h4>{{ formatDate(currentDate) }} 的订单</h4>
          <el-table :data="selectedDateOrders" style="width: 100%">
            <el-table-column prop="customer_name" label="客户姓名" min-width="100" />
            <el-table-column prop="customer_phone" label="客户电话" min-width="120" />
            <el-table-column prop="table_count" label="桌数" min-width="80" />
            <el-table-column prop="total_amount" label="总金额" min-width="100" />
            <el-table-column prop="status" label="状态" min-width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCalendarStore } from '../store/calendar';
import type { CalendarOrder } from '../types';

const calendarStore = useCalendarStore();

const currentDate = ref(new Date());
const calendarData = ref<Record<string, CalendarOrder[]>>({});

const locale = ref({
  month: {
    January: '1月',
    February: '2月',
    March: '3月',
    April: '4月',
    May: '5月',
    June: '6月',
    July: '7月',
    August: '8月',
    September: '9月',
    October: '10月',
    November: '11月',
    December: '12月'
  },
  weekday: {
    Monday: '一',
    Tuesday: '二',
    Wednesday: '三',
    Thursday: '四',
    Friday: '五',
    Saturday: '六',
    Sunday: '日'
  },
  rangeSeparator: ' 至 ',
  weekStartsOn: 1,
  firstDayOfYear: 1
});

const selectedDateOrders = computed(() => {
  const dateStr = formatDateStr(currentDate.value);
  return calendarData.value[dateStr] || [];
});

onMounted(async () => {
  await fetchCalendarData();
});

watch(currentDate, () => {
  // 当选择日期变化时，不需要重新获取数据，因为数据已经在初始化时获取了
});

const fetchCalendarData = async () => {
  try {
    const data = await calendarStore.fetchOrderCalendar();
    calendarData.value = data;
  } catch (error) {
    console.error(error);
  }
};

const formatDateStr = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const hasOrders = (date: Date) => {
  const dateStr = formatDateStr(date);
  return calendarData.value[dateStr] && calendarData.value[dateStr].length > 0;
};

const getOrdersByDate = (date: Date) => {
  const dateStr = formatDateStr(date);
  return calendarData.value[dateStr] || [];
};

const getConfirmedOrdersCount = (date: Date) => {
  const orders = getOrdersByDate(date);
  return orders.filter(order => order.status === 'confirmed').length;
};

const getPendingOrdersCount = (date: Date) => {
  const orders = getOrdersByDate(date);
  return orders.filter(order => order.status === 'pending').length;
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return '';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待确认';
    case 'confirmed':
      return '已确认';
    case 'cancelled':
      return '已取消';
    default:
      return status;
  }
};
</script>

<style scoped>
.calendar {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-content {
  margin-top: 20px;
}

.calendar-cell {
  position: relative;
  height: 80px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 4px;
}

.calendar-cell.has-orders {
  background-color: #ecf5ff;
}

.date-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.date {
  font-size: 14px;
}

.order-counts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.confirmed-count {
  font-size: 10px;
  background-color: #67C23A;
  color: white;
  border-radius: 8px;
  padding: 1px 4px;
  min-width: 40px;
  text-align: center;
}

.pending-count {
  font-size: 10px;
  background-color: #E6A23C;
  color: white;
  border-radius: 8px;
  padding: 1px 4px;
  min-width: 40px;
  text-align: center;
}

.orders {
  flex: 1;
  overflow: hidden;
}

.order-item {
  margin-bottom: 2px;
}

.order-customer {
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
}

.selected-date-orders {
  margin-top: 20px;
}

.selected-date-orders h4 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}
</style>