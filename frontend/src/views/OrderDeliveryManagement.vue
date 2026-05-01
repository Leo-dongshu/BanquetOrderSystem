<template>
  <div class="order-delivery-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单发货管理</span>
        </div>
      </template>
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
          <el-form-item>
            <el-checkbox v-model="showRecentDays" label="最近5天提醒" @change="handleRecentDaysChange" />
          </el-form-item>
        </el-form>
      </div>
      <div class="order-delivery-management-content">
        <el-table :data="pagedOrders" style="width: 100%" :fit="true" :row-class-name="tableRowClassName">
          <el-table-column label="订单编号" min-width="180" align="center">
            <template #default="scope">
              {{ scope.row.order_number }}
            </template>
          </el-table-column>
          <el-table-column label="客户名称" min-width="120" align="center">
            <template #default="scope">
              {{ scope.row.customer_name }}
            </template>
          </el-table-column>
          <el-table-column label="客户手机号" min-width="150" align="center">
            <template #default="scope">
              {{ scope.row.customer_phone }}
            </template>
          </el-table-column>
          <el-table-column label="宴席时间" min-width="180" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.feast_time) }}
            </template>
          </el-table-column>
          <el-table-column label="套餐标准" min-width="180" align="center">
            <template #default="scope">
              {{ scope.row.set_meal?.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="订单总价" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.total_amount || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="预付定金" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.deposit || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="正式桌" min-width="80" align="center">
            <template #default="scope">
              {{ scope.row.formal_tables }}
            </template>
          </el-table-column>
          <el-table-column label="备用桌" min-width="80" align="center">
            <template #default="scope">
              {{ scope.row.backup_tables }}
            </template>
          </el-table-column>
          <el-table-column label="酒席类型" min-width="120" align="center">
            <template #default="scope">
              {{ scope.row.feast_type || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="预定天数" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.booking_days || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="详细地址" min-width="300" align="center">
            <template #default="scope">
              {{ scope.row.region }} {{ scope.row.service_address }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="250" align="center" fixed="right">
            <template #default="scope">
              <div class="button-group">
                <div class="button-row">
                  <el-button type="success" size="small" @click="exportSupplierMarketTable(scope.row.id)">供应商市场单表格</el-button>
                  <el-button type="primary" size="small" @click="printEquipmentClearance(scope.row.id)">设备清货单</el-button>
                </div>
                <div class="button-row">
                  <el-button type="primary" size="small" @click="printConsumablesClearance(scope.row.id)">消耗品出货单</el-button>
                  <el-button type="primary" size="small" @click="printDishPreparation(scope.row.id)">菜品做法单</el-button>
                </div>
              </div>
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
import { ref, onMounted, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useOrderStore } from '../store/order';
import { orderApi, staffApi, kitchenwareApi, ingredientApi, categorySettingsApi } from '../api';
import type { Order, Ingredient } from '../types';
import { Solar } from 'lunar-javascript';
import * as XLSX from 'xlsx';

const orderStore = useOrderStore();

const loading = ref(false);

// 格式化日期为 "04月22日 12:30" 格式
const formatDate = (date: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
};
const orders = ref<Order[]>([]);
const users = ref<any[]>([]);
const kitchenwares = ref<any[]>([]);
const showRecentDays = ref(true);

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

// 分页相关
const currentPage = ref(1);
const pageSize = ref(15);
const total = computed(() => sortedOrders.value.length);
const pagedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return sortedOrders.value.slice(startIndex, endIndex);
});

const handleRecentDaysChange = () => {
  currentPage.value = 1;
};

const tableRowClassName = ({ row }: { row: Order }) => {
  if (showRecentDays.value && isWithinRecentDays(row)) {
    return 'recent-days-row';
  }
  return '';
};

// 搜索表单
const searchForm = reactive({
  order_number: '',
  feast_time_range: [] as string[],
  customer_name: '',
  customer_phone: ''
});

onMounted(async () => {
  await fetchOrders();
  await fetchUsers();
  await fetchKitchenwares();
});

const fetchUsers = async () => {
  try {
    const response = await staffApi.getStaffList();
    users.value = response.data;
  } catch (error) {
    console.error('获取人员列表失败:', error);
  }
};

const fetchKitchenwares = async () => {
  try {
    const response = await kitchenwareApi.getKitchenwares();
    kitchenwares.value = response.data;
  } catch (error) {
    console.error('获取厨具列表失败:', error);
  }
};

const fetchOrders = async (params?: string) => {
  loading.value = true;
  try {
    await orderStore.fetchOrders(params);
    // 只显示状态值大于等于 2 的订单
    orders.value = orderStore.orders.filter(order => order.status && Number(order.status) >= 2 && Number(order.status) !== -1);
  } catch (error) {
    console.error('获取订单列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
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
  
  await fetchOrders(params.toString());
};

const resetForm = () => {
  searchForm.order_number = '';
  searchForm.feast_time_range = [];
  searchForm.customer_name = '';
  searchForm.customer_phone = '';
  fetchOrders();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};


const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getLunarDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  return lunar.toString();
};

const printConsumablesClearance = async (orderId: number) => {
  try {
    // 获取订单信息
    const order = orders.value.find(o => o.id === orderId);
    if (!order) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 获取接单人姓名
    let receiverName = '无';
    if (order.receiver && order.receiver.name) {
      receiverName = order.receiver.name;
    } else if (order.receiver_id) {
      // 如果没有接单人信息，从人员列表中查找
      const receiver = users.value.find(user => user.id === order.receiver_id);
      if (receiver) {
        receiverName = receiver.name;
      }
    }

    // 计算总桌数
    const totalTables = order.formal_tables + order.backup_tables;
    
    // 从API获取数据
    let dryGoods: Array<{ name: string; perTable: number; totalQuantity?: number; unit: string }> = [];
    let ingredients: Array<{ name: string; perTable: number; totalQuantity?: number; unit: string }> = [];
    let disposableItems: Array<{ name: string; perTable: number }> = [];
    
    try {
      try {
        const orderDishesRes = await orderApi.getOrderDishes(orderId);
        const responseData = orderDishesRes.data || {};
        
        const orderIngredients = responseData.ingredients || [];
        
        const uniqueDryGoods = new Map();
        const uniqueIngredients = new Map();
        orderIngredients.forEach((item: any) => {
          if (item.category === '干货类' && !uniqueDryGoods.has(item.id)) {
            uniqueDryGoods.set(item.id, item);
          }
          if (item.category === '店铺食材' && !uniqueIngredients.has(item.id)) {
            uniqueIngredients.set(item.id, item);
          }
        });
        
        dryGoods = Array.from(uniqueDryGoods.values()).map((item: any) => ({
          name: item.name,
          perTable: Number(item.perTable),
          totalQuantity: Number(item.totalQuantity),
          unit: item.unit
        }));
        
        ingredients = Array.from(uniqueIngredients.values()).map((item: any) => ({
          name: item.name,
          perTable: Number(item.perTable),
          totalQuantity: Number(item.totalQuantity),
          unit: item.unit
        }));
      } catch (dishesError) {
        console.error('获取订单菜品食材失败:', dishesError);
        try {
          const dryGoodsRes = await ingredientApi.getIngredients('干货类');
          dryGoods = (dryGoodsRes.data || []).map((item: Ingredient) => ({
            name: item.name,
            perTable: Number(item.quantity),
            unit: item.unit
          }));
          const ingredientsRes = await ingredientApi.getIngredients('店铺食材');
          ingredients = (ingredientsRes.data || []).map((item: Ingredient) => ({
            name: item.name,
            perTable: Number(item.quantity),
            unit: item.unit
          }));
        } catch (fallbackError) {
          console.error('获取食材失败:', fallbackError);
          dryGoods = [];
          ingredients = [];
        }
      }
      
      // 获取一次性用品数据
      const disposableRes = await categorySettingsApi.getCategorySettings('一次性消耗品');
      disposableItems = (disposableRes.data || []).map((item: any) => ({
        name: item.name,
        perTable: 0
      }));
    } catch (apiError) {
      console.error('获取API数据失败:', apiError);
      ElMessage.warning('获取部分数据失败，使用默认数据');
    }
    
    // 生成干货标准表格行（2列布局）
    let dryGoodsRows = '';
    for (let i = 0; i < dryGoods.length; i += 2) {
      dryGoodsRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i] ? ((dryGoods[i].totalQuantity ?? (dryGoods[i].perTable * totalTables))).toFixed(2) : ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i]?.unit || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i + 1]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i + 1] ? ((dryGoods[i + 1].totalQuantity ?? (dryGoods[i + 1].perTable * totalTables))).toFixed(2) : ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dryGoods[i + 1]?.unit || ''}</td>
        </tr>
      `;
    }
    
    // 生成店铺食材标准表格行（2列布局）
    let ingredientsRows = '';
    for (let i = 0; i < ingredients.length; i += 2) {
      ingredientsRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i]?.totalQuantity ? ingredients[i].totalQuantity.toFixed(2) : ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i]?.unit || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i + 1]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i + 1]?.totalQuantity ? ingredients[i + 1].totalQuantity.toFixed(2) : ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${ingredients[i + 1]?.unit || ''}</td>
        </tr>
      `;
    }
    
    // 生成一次性用品标准表格行（2列布局）
    let disposableItemsRows = '';
    for (let i = 0; i < disposableItems.length; i += 2) {
      disposableItemsRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i] ? (disposableItems[i].perTable * totalTables).toFixed(2) : ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i + 1]?.perTable || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${disposableItems[i + 1] ? (disposableItems[i + 1].perTable * totalTables).toFixed(2) : ''}</td>
        </tr>
      `;
    }
    
    // 生成打印内容
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333; font-size: 20px; margin-bottom: 10px;">仓库消耗品清货单</h1>
        <h1 style="text-align: center; color: #666; font-size: 18px; margin-bottom: 20px;">${order.set_meal?.name || ''}/桌标准----订单编号----${order.order_number || ''}</h1>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;">日期</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_time ? new Date(order.feast_time).toLocaleDateString('zh-CN') : ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">桌数</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">正式桌: ${order.formal_tables} 备用: ${order.backup_tables}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;">酒席类型</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_type || '其他'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;">开席时间</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_time ? new Date(order.feast_time).toLocaleTimeString('zh-CN') : ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">标准</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">${order.set_meal?.name || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;">客户姓名</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.customer_name || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;">客户联系方式</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.customer_phone || ''}<br>${order.customer_phone2 || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">地址</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">${order.region || ''}${order.service_address || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 15%;"></td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;"></td>
          </tr>
        </table>
        
        <!-- 干货标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">干货标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">单位</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">单位</th>
          </tr>
          ${dryGoodsRows}
        </table>
        
        <!-- 店铺食材标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">店铺食材标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">单位</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">单位</th>
          </tr>
          ${ingredientsRows}
        </table>
        
        <!-- 一次性用品标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">一次性用品标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">每桌</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
          </tr>
          ${disposableItemsRows}
        </table>
        
        <!-- 酒水礼包标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">酒水礼包标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
          </tr>
        </table>
        
        <!-- 调料标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">调料标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 15%;">单位</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">总数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 15%;">单位</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
            <td style="padding: 8px; border: 1px solid #000; text-align: center;"></td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 20%;">备注</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${order.remark || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 20%;">接单人</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${receiverName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 20%;">复查人签字</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;"></td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px; font-size: 16px;">
          订单编号----${order.order_number || ''}
        </div>
      </div>
    `;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>消耗品出货单</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // 等待打印窗口加载完成后执行打印
      printWindow.onload = function() {
        printWindow.print();
        // 打印后关闭窗口
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
  } catch (error) {
    console.error('打印失败:', error);
    ElMessage.error('打印失败');
  }
};

const printDishPreparation = async (orderId: number) => {
  try {
    // 获取订单信息
    const order = orders.value.find(o => o.id === orderId);
    if (!order) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 获取订单菜品信息
    let dishes = [];
    try {
      const response = await orderApi.getOrderDishes(orderId);
      const responseData = response.data || {};
      dishes = responseData.dishes || [];
      // console.log('获取到的菜品数据:', dishes);
      if (!dishes || dishes.length === 0) {
        ElMessage.warning('订单没有菜品信息，无法打印菜品做法单');
        return;
      }
    } catch (error) {
      console.error('获取订单菜品失败:', error);
      ElMessage.warning('获取订单菜品失败，无法打印菜品做法单');
      return;
    }
    
    // 获取接单人姓名
    let receiverName = '无';
    if (order.receiver && order.receiver.name) {
      receiverName = order.receiver.name;
    } else if (order.receiver_id) {
      // 如果没有接单人信息，从人员列表中查找
      const receiver = users.value.find(user => user.id === order.receiver_id);
      if (receiver) {
        receiverName = receiver.name;
      }
    }

    // 生成菜品表格行
    const dishRows = dishes.map((dish, index) => {
      // 组合做法信息：烹饪方法 + 做法描述
      let cookingInfo = '';
      if (dish.cookingMethod) {
        cookingInfo += dish.cookingMethod;
      }
      if (dish.cookingDescription) {
        if (cookingInfo) {
          cookingInfo += ' - ';
        }
        cookingInfo += dish.cookingDescription;
      }
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dish.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: left; white-space: pre-wrap;">${cookingInfo || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dish.dishware || ''}</td>
        </tr>
      `;
    }).join('');
    
    // 生成打印内容
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333; font-size: 18px; margin-bottom: 10px;">菜品做法单</h1>
        <h1 style="text-align: center; color: #666; font-size: 14px; margin-bottom: 20px;">${order.set_meal?.name}/桌标准----订单编号----${order.order_number || ''}</h1>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 8%;">日期</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_time ? new Date(order.feast_time).toLocaleDateString('zh-CN') : ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 12%;">桌数</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">正式桌: ${order.formal_tables} 备用: ${order.backup_tables}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">开席时间</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_time ? new Date(order.feast_time).toLocaleTimeString('zh-CN') : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 8%;">地址</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.region || ''}${order.service_address || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 12%;">客户名称</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.customer_name || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">客户联系方式</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.customer_phone || ''}</td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 5%;">序号</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 15%;">菜名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 50%;">做法</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 30%;">盘碗</th>
          </tr>
          ${dishRows}
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">备注</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${order.remark || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">接单人</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${receiverName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">复查人签字</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;"></td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          订单编号----${order.order_number || ''}
        </div>
      </div>
    `;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>菜品做法单</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // 等待打印窗口加载完成后执行打印
      printWindow.onload = function() {
        printWindow.print();
        // 打印后关闭窗口
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
  } catch (error) {
    console.error('打印失败:', error);
    ElMessage.error('打印失败');
  }
};

const exportSupplierMarketTable = async (orderId: number) => {
  try {
    // 获取订单信息
    const order = orders.value.find(o => o.id === orderId);
    if (!order) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 计算总桌数
    const totalTables = order.formal_tables + order.backup_tables;
    
    // 定义分类和对应的颜色
    const categories = [
      { name: '禽类', color: '#FFFF00' },      // 黄色
      { name: '蔬菜类', color: '#FF9999' },     // 粉色
      { name: '猪肉类', color: '#9999FF' },     // 紫色
      { name: '牛羊肉类', color: '#FF9900' },   // 橙色
      { name: '水产类', color: '#99CCFF' },     // 浅蓝色
      { name: '本地食材', color: '#99FF99' }    // 浅绿色
    ];
    
    // 从API获取订单的菜品和食材数据
    const orderDishesRes = await orderApi.getOrderDishes(orderId);
    const responseData = orderDishesRes.data || {};
    const orderIngredients = responseData.ingredients || [];
    
    // 按分类组织数据
    const categoryData: Record<string, Array<{ name: string; quantity: number; unit: string }>> = {};
    
    // 初始化分类数据结构
    categories.forEach(category => {
      categoryData[category.name] = [];
    });
    
    // 处理订单食材数据
    orderIngredients.forEach(ingredient => {
      const category = ingredient.category || '其他';
      if (categoryData[category]) {
        categoryData[category].push({
          name: ingredient.name || '',
          quantity: ingredient.perTable || 0,
          unit: ingredient.unit || ''
        });
      } else {
        // 如果分类不在预定义列表中，添加到其他分类
        if (!categoryData['其他']) {
          categoryData['其他'] = [];
        }
        categoryData['其他'].push({
          name: ingredient.name || '',
          quantity: ingredient.perTable || 0,
          unit: ingredient.unit || ''
        });
      }
    });
    
    // 确定最大行数
    const maxRows = Math.max(...Object.values(categoryData).map(items => items.length));
    
    // 生成HTML表格
    let html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: landscape;
            margin: 5mm;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
            table-layout: fixed;
          }
          th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .category-cell {
            text-align: center;
            font-weight: bold;
            height: 25px;
          }
          .header-cell {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="title">供应商市场单</div>
        <table>
          <colgroup>
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 80px;">
            <col style="width: 60px;">
          </colgroup>
          <!-- 标题行 -->
          <tr>
            <td colspan="18" style="text-align: center; font-size: 16px; font-weight: bold;">
              ${order.feast_time ? formatDate(order.feast_time) : ''} ---- ${order.order_number || ''}
            </td>
          </tr>
          <!-- 订单信息 -->
          <tr>
            <td style="font-weight: bold;">酒席编号</td>
            <td colspan="3"><span style="mso-number-format:'\@'">${order.order_number || ''}</span></td>
            <td colspan="2" style="font-weight: bold;">开席日期</td>
            <td colspan="3">${order.feast_time ? formatDate(order.feast_time) : ''}</td>
            <td style="font-weight: bold;">酒席地址</td>
            <td colspan="8">${order.region || ''}${order.service_address || ''}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">酒席桌数</td>
            <td colspan="3">${`正式：${order.formal_tables}，备用：${order.backup_tables}`}</td>
            <td colspan="2" style="font-weight: bold;">配送日期</td>
            <td colspan="3">${order.feast_time ? formatDate(new Date(new Date(order.feast_time).setHours(5, 0, 0, 0))) : ''}</td>
            <td style="font-weight: bold;">送货地址</td>
            <td colspan="3">门店</td>
            <td colspan="2" style="font-weight: bold;">酒席类型</td>
            <td colspan="3">${order.feast_type || '其他'}</td>
          </tr>
          <tr><td colspan="18"></td></tr>
          <!-- 分类标题行 -->
          <tr>
    `;
    
    // 添加分类标题
    categories.forEach(cat => {
      html += `
        <td colspan="3" class="category-cell" style="background-color: ${cat.color};">${cat.name}</td>
      `;
    });
    
    html += `
          </tr>
          <!-- 表头行 -->
          <tr>
    `;
    
    // 添加表头
    categories.forEach(() => {
      html += `
        <td class="header-cell">菜品</td>
        <td class="header-cell">份量</td>
        <td class="header-cell">单位</td>
      `;
    });
    
    html += `
          </tr>
    `;
    
    // 添加数据行
    for (let i = 0; i < maxRows; i++) {
      html += `
          <tr>
      `;
      
      categories.forEach(cat => {
        const item = categoryData[cat.name][i];
        if (item) {
          html += `
            <td>${item.name}</td>
            <td style="text-align: center; color: red;">${item.quantity}</td>
            <td style="text-align: center;">${item.unit}</td>
          `;
        } else {
          html += `
            <td></td>
            <td></td>
            <td></td>
          `;
        }
      });
      
      html += `
          </tr>
      `;
    }
    
    html += `
        </table>
      </body>
      </html>
    `;
    
    // 创建Blob并下载
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `供应商市场单_${order.order_number || ''}_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
};

const printEquipmentClearance = async (orderId: number) => {
  try {
    // 获取订单信息
    const order = orders.value.find(o => o.id === orderId);
    if (!order) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 获取订单菜品信息
    let dishes = [];
    try {
      const response = await orderApi.getOrderDishes(orderId);
      const responseData = response.data || {};
      dishes = responseData.dishes || [];
      if (!dishes || dishes.length === 0) {
        ElMessage.warning('订单没有菜品信息，无法打印设备请货单');
        return;
      }
    } catch (error) {
      console.error('获取订单菜品失败:', error);
      ElMessage.warning('获取订单菜品失败，无法打印设备请货单');
      return;
    }
    
    // 获取接单人姓名
    let receiverName = '无';
    if (order.receiver && order.receiver.name) {
      receiverName = order.receiver.name;
    } else if (order.receiver_id) {
      // 如果没有接单人信息，从人员列表中查找
      const receiver = users.value.find(user => user.id === order.receiver_id);
      if (receiver) {
        receiverName = receiver.name;
      }
    }

    // 计算总桌数
    const totalTables = order.formal_tables + order.backup_tables;
    
    // 生成盘碗清货标准表格行
    const dishwareRows = dishes.map((dish, index) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #000; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dish.name || ''}</td>
        <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dish.dishware || ''}</td>
        <td style="padding: 8px; border: 1px solid #000; text-align: center;">1</td>
        <td style="padding: 8px; border: 1px solid #000; text-align: center;">${totalTables}</td>
      </tr>
    `).join('');
    
    // 获取厨房小设备数据
    const smallKitchenwares = kitchenwares.value.filter(item => item.type === '厨房小设备');
    // 生成厨房小设备清货标准表格行
    let smallKitchenwareRows = '';
    for (let i = 0; i < smallKitchenwares.length; i += 3) {
      smallKitchenwareRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i]?.quantity || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i + 1]?.quantity || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i + 2]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${smallKitchenwares[i + 2]?.quantity || ''}</td>
        </tr>
      `;
    }
    
    // 获取大设备数据
    const largeKitchenwares = kitchenwares.value.filter(item => item.type === '大设备');
    // 生成大设备清货标准表格行
    let largeKitchenwareRows = '';
    for (let i = 0; i < largeKitchenwares.length; i += 3) {
      largeKitchenwareRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i]?.quantity * totalTables || ''}</td>  
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i + 1]?.quantity * totalTables || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i + 2]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${largeKitchenwares[i + 2]?.quantity * totalTables || ''}</td>
        </tr>
      `;
    }
    
    // 盘碗统计：根据dishware分组汇总
    const dishwareStats = dishes.reduce((acc, dish) => {
      if (dish.dishware) {
        if (!acc[dish.dishware]) {
          acc[dish.dishware] = 0;
        }
        acc[dish.dishware] += totalTables;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // 转换为数组并生成盘碗统计表格行
    const dishwareStatsArray = Object.entries(dishwareStats).map(([name, quantity]) => ({ name, quantity }));
    let dishwareStatsRows = '';
    for (let i = 0; i < dishwareStatsArray.length; i += 3) {
      dishwareStatsRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i]?.quantity || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i + 1]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i + 1]?.quantity || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i + 2]?.name || ''}</td>
          <td style="padding: 8px; border: 1px solid #000; text-align: center;">${dishwareStatsArray[i + 2]?.quantity || ''}</td>
        </tr>
      `;
    }
    
    // 生成打印内容
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333; font-size: 20px; margin-bottom: 10px;">仓库盘碗设备清货单</h1>
        <h1 style="text-align: center; color: #666; font-size: 18px; margin-bottom: 20px;">${order.set_meal?.name}/桌标准----订单编号----${order.order_number || ''}</h1>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">日期</td>
            <td style="padding: 8px; border: 1px solid #000; width: 15%;">${order.feast_time ? new Date(order.feast_time).toLocaleDateString('zh-CN') : ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">桌数</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">正式桌: ${order.formal_tables} 备用: ${order.backup_tables}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">开席时间</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.feast_time ? new Date(order.feast_time).toLocaleTimeString('zh-CN') : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">标准</td>
            <td style="padding: 8px; border: 1px solid #000; width: 15%;">${order.set_meal?.name || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">办事类型</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">${order.feast_type || '其他'}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">客户姓名</td>
            <td style="padding: 8px; border: 1px solid #000; width: 15%;">${order.customer_name || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">客户联系方式</td>
            <td style="padding: 8px; border: 1px solid #000; width: 25%;">${order.customer_phone || ''}<br>${order.customer_phone2 || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">地址</td>
            <td style="padding: 8px; border: 1px solid #000; width: 20%;">${order.region || ''}${order.service_address || ''}</td>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;"></td>
            <td style="padding: 8px; border: 1px solid #000; width: 15%;"></td>
          </tr>
        </table>
        
        <!-- 盘碗清货标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">盘碗清货标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; border: 1px solid #000; text-align: center; width: 8%;">序号</th>
            <th style="padding: 10px; border: 1px solid #000; text-align: center; width: 30%;">菜名</th>
            <th style="padding: 10px; border: 1px solid #000; text-align: center; width: 20%;">品名</th>
            <th style="padding: 10px; border: 1px solid #000; text-align: center; width: 15%;">每桌数量</th>
            <th style="padding: 10px; border: 1px solid #000; text-align: center; width: 15%;">总数量</th>
          </tr>
          ${dishwareRows}
        </table>
        
        <!-- 厨房小设备清货标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">厨房小设备清货标准</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
          </tr>
          ${smallKitchenwareRows || `
            <tr>
              <td style="padding: 8px; border: 1px solid #000; text-align: center; colspan="6">暂无厨房小设备数据</td>
            </tr>
          `}
        </table>
        
        <!-- 盘碗统计表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">盘碗统计</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
          </tr>
          ${dishwareStatsRows || `
            <tr>
              <td style="padding: 8px; border: 1px solid #000; text-align: center; colspan="6">暂无盘碗数据</td>
            </tr>
          `}
        </table>
        
        <!-- 大设备清货标准表格 -->
        <h1 style="text-align: left; color: #333; font-size: 18px; margin-bottom: 10px;">大设备统计</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 23%;">品名</th>
            <th style="padding: 8px; border: 1px solid #000; text-align: center; width: 10%;">数量</th>
          </tr>
          ${largeKitchenwareRows || `
            <tr>
              <td style="padding: 8px; border: 1px solid #000; text-align: center; colspan="6">暂无大设备数据</td>
            </tr>
          `}
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">备注</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${order.remark || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">接单人</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;">${receiverName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #000; font-weight: bold; width: 10%;">复查人签字</td>
            <td style="padding: 8px; border: 1px solid #000; width: 90%;"></td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px; font-size: 16px;">
          订单编号----${order.order_number || ''}
        </div>
      </div>
    `;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>设备请货单</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // 等待打印窗口加载完成后执行打印
      printWindow.onload = function() {
        printWindow.print();
        // 打印后关闭窗口
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
  } catch (error) {
    console.error('打印失败:', error);
    ElMessage.error('打印失败');
  }
};
</script>

<style scoped>
.order-delivery-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.order-delivery-management-content {
  margin-top: 20px;
}

/* 确保表格列能够自适应宽度 */
:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  width: 100% !important;
}

:deep(.el-table__header),
:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table-column) {
  min-width: 0 !important;
}

/* 表格列居中对齐 */
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center !important;
  vertical-align: middle !important;
}

/* 表格单元格内容居中 */
:deep(.el-table th .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
}

/* 表格数据单元格内容居中，支持多行文本 */
:deep(.el-table td .cell) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 100% !important;
  min-height: 40px !important;
  white-space: pre-wrap !important;
  word-break: break-all !important;
}

/* 操作按钮间距 */
:deep(.el-table td .el-button) {
  margin-right: 8px;
  margin-bottom: 4px;
}

:deep(.el-table td .el-button:last-child) {
  margin-right: 0;
}

/* 按钮组布局 */
.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}

/* 第一行按钮 */
.button-row {
  display: flex;
  margin-bottom: 4px;
  width: 100%;
  justify-content: flex-end;
}

/* 第二行按钮 */
.second-row-button {
  margin-top: 8px;
  margin-right: 0 !important;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .recent-days-row) {
  --el-table-tr-bg-color: #fdf6ec;
}

:deep(.el-table .recent-days-row:hover > td) {
  --el-table-tr-bg-color: #faecd8 !important;
}
</style>