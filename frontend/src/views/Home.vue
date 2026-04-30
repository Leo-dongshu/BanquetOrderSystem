<template>
  <div class="home">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card stat-revenue">
          <div class="stat-icon">
            <el-icon :size="32"><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">订单总金额</div>
            <div class="stat-value">¥{{ formatMoney(stats.total_amount) }}</div>
            <div class="stat-sub">已优惠金额: ¥{{ formatMoney(stats.total_discount) }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-payment">
          <div class="stat-icon">
            <el-icon :size="32"><Wallet /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">已收款总金额</div>
            <div class="stat-value">¥{{ formatMoney(stats.total_revenue) }}</div>
            <div class="stat-sub">待回款: ¥{{ formatMoney(stats.pending_payment) }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-orders">
          <div class="stat-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">订单总数</div>
            <div class="stat-value">{{ stats.total_orders }}</div>
            <div class="stat-sub">总桌数: {{ stats.total_tables }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-quick-action">
          <div class="stat-content">
            <div class="stat-label">快捷操作</div>
            <div class="quick-actions">
              <el-button type="primary" size="small" @click="navigateTo('/orders/create')">创建订单</el-button>
              <el-button type="warning" size="small" @click="navigateTo('/orders/staff-arrangement')">人员安排</el-button>
              <el-button type="info" size="small" @click="navigateTo('/orders/delivery-management')">发货管理</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 日历和饼图区域 -->
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="hover" class="calendar-card">
          <template #header>
            <div class="card-header-title">订单日历</div>
          </template>
          <div class="calendar-content">
            <div class="simple-calendar">
              <div class="calendar-header">
                <el-button circle size="small" @click="prevMonth">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <h3>{{ currentMonthText }}</h3>
                <el-button circle size="small" @click="nextMonth">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
              <div class="calendar-weekdays">
                <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
              </div>
              <div class="calendar-days">
                <div 
                  v-for="(day, index) in calendarDays" 
                  :key="index"
                  class="calendar-day"
                  :class="{
                    'empty': !day.date,
                    'today': day.isToday,
                    'has-orders': day.orderCount > 0,
                    'other-month': day.isPrevMonth || day.isNextMonth
                  }"
                >
                  <span v-if="day.date" class="day-number">{{ day.day }}</span>
                  <div class="order-stats" v-if="day.orderCount > 0">
                    <div class="stat-item total" v-if="day.totalTables > 0">
                      <span class="stat-label">总桌数</span>
                      <span class="stat-value">{{ day.totalTables }}</span>
                    </div>
                    <div class="stat-item pending" v-if="day.pendingArrangeCount > 0">
                      <span class="stat-label">待安排</span>
                      <span class="stat-value">{{ day.pendingArrangeCount }}</span>
                    </div>
                    <div class="stat-item arranged" v-if="day.arrangedCount > 0">
                      <span class="stat-label">已安排</span>
                      <span class="stat-value">{{ day.arrangedCount }}</span>
                    </div>
                    <div class="stat-item payment" v-if="day.pendingPaymentCount > 0">
                      <span class="stat-label">待回款</span>
                      <span class="stat-value">{{ day.pendingPaymentCount }}</span>
                    </div>
                    <div class="stat-item completed" v-if="day.completedCount > 0">
                      <span class="stat-label">已完成</span>
                      <span class="stat-value">{{ day.completedCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header-title">宴席类型统计</div>
          </template>
          <div ref="pieChartRef" class="chart-content"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { statsApi, orderApi } from '../api';
import { formatMoney as formatMoneyUtil } from '../utils/dateFormat';
import { Money, Document, Wallet, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

const router = useRouter();

// 统计数据
const stats = reactive({
  total_orders: 0,
  total_amount: 0,
  monthly_amount: 0,
  total_discount: 0,
  monthly_discount: 0,
  total_revenue: 0,
  monthly_revenue: 0,
  pending_payment: 0,
  monthly_pending_payment: 0,
  total_tables: 0,
  pending_arrange: 0,
  arranged: 0,
  pending_payment_count: 0,
  completed: 0,
  cancelled: 0
});

// 格式化金额
const formatMoney = (value: number | undefined) => {
  return formatMoneyUtil(value);
};

// 计算已安排占比
const arrangedPercent = computed(() => {
  if (stats.total_orders === 0) return 0;
  return Math.round((stats.arranged / stats.total_orders) * 100);
});

// 计算取消率
const cancelledPercent = computed(() => {
  if (stats.total_orders === 0) return 0;
  return Math.round((stats.cancelled / stats.total_orders) * 100);
});

// 日历相关变量
const currentDate = ref(new Date());
const currentMonthText = ref('');
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const calendarDays = ref<any[]>([]);
const ordersForCalendar = ref<any[]>([]);

// 宴席类型统计
const feastTypeStats = ref<any[]>([]);
const pieColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
const pieChartRef = ref<HTMLElement>();
let pieChart: any = null;

const hoveredFeastType = ref('');

const initPieChart = () => {
  if (!pieChartRef.value) {
    return;
  }
  
  try {
    if (!pieChart) {
      pieChart = echarts.init(pieChartRef.value);
    }
    
    if (feastTypeStats.value.length > 0) {
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}单 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 0,
          left: 0,
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 10,
          textStyle: {
            fontSize: 12,
            color: '#606266'
          }
        },
        color: pieColors,
        graphic: hoveredFeastType.value ? [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: hoveredFeastType.value,
              textAlign: 'center',
              fill: '#303133',
              fontSize: 16,
              fontWeight: 'bold'
            }
          }
        ] : [],
        series: [
          {
            name: '宴席类型',
            type: 'pie',
            radius: ['50%', '85%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data: feastTypeStats.value
          }
        ]
      }, true);

      // pieChart.off('mouseover');
      // pieChart.off('mouseout');
      // pieChart.on('mouseover', (params: any) => {
      //   hoveredFeastType.value = params.name;
      //   initPieChart();
      // });
      // pieChart.on('mouseout', () => {
      //   hoveredFeastType.value = '';
      //   initPieChart();
      // });
    }
  } catch (e) {
    console.error('initPieChart error:', e);
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  generateCalendar();
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  generateCalendar();
};

const fetchFeastTypeStats = () => {
  const feastTypeMap: Record<string, number> = {};
  
  ordersForCalendar.value.forEach(order => {
    const type = order.feast_type || '未知';
    feastTypeMap[type] = (feastTypeMap[type] || 0) + 1;
  });
  
  const total = ordersForCalendar.value.length;
  
  if (total > 0) {
    feastTypeStats.value = Object.entries(feastTypeMap).map(([name, count]) => ({
      name,
      value: count,
      count,
      percent: Math.round((count / total) * 100)
    }));
  } else {
    feastTypeStats.value = [];
  }
  
  // 初始化饼图
  nextTick(() => {
    initPieChart();
  });
};

const formatDateStr = (date: any) => {
  if (!date) return '';
  // 如果date已经是字符串格式，直接返回
  if (typeof date === 'string') {
    // 如果是完整的ISO格式，只取日期部分
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    return date;
  }
  // 确保date是Date对象
  const dateObj = new Date(date);
  // 手动构建YYYY-MM-DD格式的字符串，避免时区偏移
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateCalendar = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  currentMonthText.value = `${year}年${month + 1}月`;
  
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const days = [];
  
  // 获取上个月的最后几天用于补齐第一周
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = prevMonthDays - i;
    const date = new Date(year, month - 1, prevDate);
    const dateStr = formatDateStr(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isTodayOrPast = date <= today;
    
    const dayOrders = ordersForCalendar.value.filter(order => {
      const orderDate = formatDateStr(order.service_date);
      return orderDate === dateStr;
    });
    
    const orderCount = dayOrders.length;
    const pendingArrangeCount = dayOrders.filter(order => order.status === 1).length;
    const arrangedCount = dayOrders.filter(order => order.status === 2).length;
    const pendingPaymentCount = isTodayOrPast ? dayOrders.filter(order => order.status === 3).length : 0;
    const completedCount = isTodayOrPast ? dayOrders.filter(order => order.status === 9).length : 0;
    const totalTables = dayOrders.reduce((sum, order) => sum + (order.formal_tables || 0) + (order.backup_tables || 0), 0);
    
    days.push({
      date,
      day: prevDate,
      isToday: false,
      isPrevMonth: true,
      orderCount,
      pendingArrangeCount,
      arrangedCount,
      pendingPaymentCount,
      completedCount,
      totalTables
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = formatDateStr(date);
    const isToday = date.getFullYear() === new Date().getFullYear() &&
                   date.getMonth() === new Date().getMonth() &&
                   date.getDate() === new Date().getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isTodayOrPast = date <= today;
    
    const dayOrders = ordersForCalendar.value.filter(order => {
      const orderDate = formatDateStr(order.service_date);
      return orderDate === dateStr;
    });
    
    const orderCount = dayOrders.length;
    const pendingArrangeCount = dayOrders.filter(order => order.status === 1).length;
    const arrangedCount = dayOrders.filter(order => order.status === 2).length;
    const pendingPaymentCount = isTodayOrPast ? dayOrders.filter(order => order.status === 3).length : 0;
    const completedCount = isTodayOrPast ? dayOrders.filter(order => order.status === 9).length : 0;
    const totalTables = dayOrders.reduce((sum, order) => sum + (order.formal_tables || 0) + (order.backup_tables || 0), 0);
    
    days.push({
      date,
      day: i,
      isToday,
      isPrevMonth: false,
      orderCount,
      pendingArrangeCount,
      arrangedCount,
      pendingPaymentCount,
      completedCount,
      totalTables
    });
  }
  
  // 补齐到42天（6周），确保最后一周完整显示到周六
  while (days.length < 42) {
    const currentLength = days.length;
    const nextMonthDayNum = currentLength - startDay - daysInMonth + 1;
    const date = new Date(year, month + 1, nextMonthDayNum);
    const dateStr = formatDateStr(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isTodayOrPast = date <= today;
    
    const dayOrders = ordersForCalendar.value.filter(order => {
      const orderDate = formatDateStr(order.service_date);
      return orderDate === dateStr;
    });
    
    const orderCount = dayOrders.length;
    const pendingArrangeCount = dayOrders.filter(order => order.status === 1).length;
    const arrangedCount = dayOrders.filter(order => order.status === 2).length;
    const pendingPaymentCount = isTodayOrPast ? dayOrders.filter(order => order.status === 3).length : 0;
    const completedCount = isTodayOrPast ? dayOrders.filter(order => order.status === 9).length : 0;
    const totalTables = dayOrders.reduce((sum, order) => sum + (order.formal_tables || 0) + (order.backup_tables || 0), 0);
    
    days.push({
      date,
      day: nextMonthDayNum,
      isToday: false,
      isNextMonth: true,
      orderCount,
      pendingArrangeCount,
      arrangedCount,
      pendingPaymentCount,
      completedCount,
      totalTables
    });
  }
  
  calendarDays.value = days;
};

const fetchCalendarData = async () => {
  try {
    const res = await orderApi.getOrders();
    ordersForCalendar.value = (res.data || []).filter((order: any) => order.status !== -1);
    generateCalendar();
    fetchFeastTypeStats();
  } catch (error) {
    console.error('获取日历数据失败:', error);
  }
};

const fetchDashboardStats = async () => {
  try {
    const res = await statsApi.getDashboardStats();
    Object.assign(stats, res.data);
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

onMounted(() => {
  fetchDashboardStats();
  fetchCalendarData();
});
</script>

<style scoped>
.home {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 22px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  gap: 15px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-revenue {
  background: #409eff;
}

.stat-orders {
  background: #67c23a;
}

.stat-pending {
  background: #e6a23c;
}

.stat-completed {
  background: #909399;
}

.stat-payment {
  background: #f56c6c;
}

.stat-arranged {
  background: #d48265;
}

.stat-cancelled {
  background: #c45656;
}

.stat-quick-action {
  background: #95b1ea;
  min-height: 116px;
}

.stat-icon {
  width: 66px;
  height: 66px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-content {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-sub {
  font-size: 12px;
  opacity: 0.8;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  justify-content: flex-start;
}

.quick-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.quick-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.calendar-content {
  max-width: 1200px;
  margin: 20px auto 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-title {
  font-size: 16px;
  font-weight: bold;
}

.calendar-card,
.chart-card {
  margin-top: 20px;
}

.chart-content {
  padding: 20px;
  min-height: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pie-container {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 10px;
}

.pie-visual {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.pie-center-text {
  font-size: 24px;
  font-weight: bold;
  fill: #303133;
}

.pie-center-label {
  font-size: 10px;
  fill: #909399;
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.legend-item:hover {
  background: #ecf5ff;
  transform: translateX(5px);
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.legend-value {
  font-size: 13px;
  color: #606266;
}

.pie-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pie-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.pie-info {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.pie-label {
  font-size: 14px;
  color: #303133;
}

.pie-value {
  font-size: 14px;
  color: #606266;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}

.card-content {
  padding: 20px 0;
}

.card-content .el-button {
  margin-right: 10px;
}

.action-card {
  height: 100%;
}

/* 简单日历样式 */
.simple-calendar {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 12px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  min-width: 120px;
  text-align: center;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.weekday {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  padding: 10px;
  background: #409eff;
  border-radius: 8px;
}

.weekday:nth-child(1), .weekday:nth-child(7) {
  background: #a0cfff;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  position: relative;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  border-radius: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-day.empty {
  background: transparent;
  border: none;
  cursor: default;
}

.calendar-day.empty:hover {
  transform: none;
  box-shadow: none;
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.other-month .day-number {
  color: #909399;
}

.calendar-day.today {
  background: linear-gradient(135deg, #e8f8f5 0%, #d5f5e3 100%);
  border-color: #27ae60;
}

.calendar-day.today .day-number {
  background: #27ae60;
  color: white;
}

.calendar-day.has-orders {
  background: linear-gradient(135deg, #ebf5fb 0%, #d6eaf8 100%);
  border-color: #3498db;
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  border-radius: 50%;
}

.order-stats {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  margin-top: 2px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.stat-item.total {
  background: linear-gradient(135deg, #00b8d4 0%, #0097a7 100%);
  color: white;
}

.stat-item.pending {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
}

.stat-item.arranged {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.stat-item.payment {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  color: white;
}

.stat-item.completed {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
}

.stat-item .stat-value {
  font-weight: 700;
  font-size: 14px;
}

.stat-item .stat-label {
  font-size: 11px;
  opacity: 0.9;
}
</style>