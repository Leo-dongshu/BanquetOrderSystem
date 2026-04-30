<template>
  <div class="order-staff-arrangement">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单人员安排</span>
        </div>
      </template>
      <div class="search-form">
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
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择订单状态" style="width: 180px;">
              <el-option label="全部" value="" />
              <el-option label="待安排" value="1" />
              <el-option label="已安排" value="2" />
            </el-select>
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
      <div class="order-staff-arrangement-content">
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
          <el-table-column label="客户电话" min-width="150" align="center">
            <template #default="scope">
              {{ scope.row.customer_phone }}
            </template>
          </el-table-column>
          <el-table-column label="宴席时间" min-width="180" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.feast_time) }}
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
          <el-table-column label="套餐标准" min-width="180" align="center">
            <template #default="scope">
              {{ scope.row.set_meal?.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="酒席类型" min-width="120" align="center">
            <template #default="scope">
              {{ scope.row.feast_type || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="预付定金" min-width="100" align="center">
            <template #default="scope">
              {{ scope.row.deposit || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="人员安排" min-width="120" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.status >= 2 ? 'success' : 'warning'">
                {{ scope.row.status >= 2 ? '已安排' : '未安排' }}
              </el-tag>
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
          <el-table-column label="操作" min-width="180" align="center" fixed="right">
            <template #default="scope">
              <div style="display: flex; justify-content: flex-end; width: 100%;">
                <el-button type="primary" size="small" @click="arrangeStaff(scope.row)" style="margin-right: 8px;">
                  {{ scope.row.status >= 2 ? '更改人员安排' : '人员安排' }}
                </el-button>
                <el-button type="primary" size="small" @click="printOrder(scope.row.id)">
                  打印
                </el-button>
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

    <!-- 人员安排对话框 -->
    <el-dialog
      v-model="showArrangeDialog"
      title="人员安排"
      width="800px"
    >
      <div class="arrange-dialog-content">
        <el-form :model="arrangeForm" label-width="120px">
          <!-- 订单基本信息 -->
          <el-form-item label="订单编号">
            <el-input v-model="arrangeForm.order_number" disabled />
          </el-form-item>
          <el-form-item label="宴席时间">
            <el-input v-model="arrangeForm.feast_time" disabled />
          </el-form-item>
          <el-form-item label="出发时间" required>
            <el-date-picker
              v-model="arrangeForm.departure_time"
              type="datetime"
              placeholder="请选择出发时间"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="到达时间" required>
            <el-date-picker
              v-model="arrangeForm.arrival_time"
              type="datetime"
              placeholder="请选择到达时间"
              style="width: 100%"
            />
          </el-form-item>
          
          <!-- 人员安排 -->
          <el-form-item label="厨师" required>
            <el-select v-model="arrangeForm.chefs" multiple placeholder="请选择厨师" filterable style="width: 100%">
              <el-option
                v-for="chef in chefOptions"
                :key="chef.value"
                :label="`${chef.label} (${chef.phone || '无电话'})`"
                :value="chef.value"
              />
            </el-select>
            <!-- 已选择的厨师列表 -->
            <div v-if="arrangeForm.chefs.length > 0" class="selected-staff-list">
              <div class="selected-staff-header">
                <div class="staff-name">姓名</div>
                <div class="staff-phone">手机号</div>
                <div class="staff-action">操作</div>
              </div>
              <div v-for="(chefValue, index) in arrangeForm.chefs" :key="chefValue" class="selected-staff-item">
                <div class="staff-name">{{ getStaffName(chefValue, 'chef') }}</div>
                <div class="staff-phone">{{ getStaffPhone(chefValue, 'chef') }}</div>
                <div class="staff-action">
                  <el-button type="danger" size="small" @click="removeStaff('chefs', index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="服务员" required>
            <el-select v-model="arrangeForm.waiters" multiple placeholder="请选择服务员" filterable style="width: 100%">
              <el-option
                v-for="waiter in waiterOptions"
                :key="waiter.value"
                :label="`${waiter.label} (${waiter.phone || '无电话'})`"
                :value="waiter.value"
              />
            </el-select>
            <!-- 已选择的服务员列表 -->
            <div v-if="arrangeForm.waiters.length > 0" class="selected-staff-list">
              <div class="selected-staff-header">
                <div class="staff-name">姓名</div>
                <div class="staff-phone">手机号</div>
                <div class="staff-action">操作</div>
              </div>
              <div v-for="(waiterValue, index) in arrangeForm.waiters" :key="waiterValue" class="selected-staff-item">
                <div class="staff-name">{{ getStaffName(waiterValue, 'waiter') }}</div>
                <div class="staff-phone">{{ getStaffPhone(waiterValue, 'waiter') }}</div>
                <div class="staff-action">
                  <el-button type="danger" size="small" @click="removeStaff('waiters', index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="司机">
            <el-select v-model="arrangeForm.drivers" multiple placeholder="请选择司机" filterable style="width: 100%">
              <el-option
                v-for="driver in driverOptions"
                :key="driver.value"
                :label="`${driver.label} (${driver.phone || '无电话'})`"
                :value="driver.value"
              />
            </el-select>
            <!-- 已选择的司机列表 -->
            <div v-if="arrangeForm.drivers.length > 0" class="selected-staff-list">
              <div class="selected-staff-header">
                <div class="staff-name">姓名</div>
                <div class="staff-phone">手机号</div>
                <div class="staff-action">操作</div>
              </div>
              <div v-for="(driverValue, index) in arrangeForm.drivers" :key="driverValue" class="selected-staff-item">
                <div class="staff-name">{{ getStaffName(driverValue, 'driver') }}</div>
                <div class="staff-phone">{{ getStaffPhone(driverValue, 'driver') }}</div>
                <div class="staff-action">
                  <el-button type="danger" size="small" @click="removeStaff('drivers', index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="车辆">
            <el-select v-model="arrangeForm.vehicles" multiple placeholder="请选择车辆" filterable style="width: 100%">
              <!-- 按车辆类型分组 -->
              <el-option-group
                v-for="type in vehicleTypes"
                :key="type"
                :label="type"
              >
                <el-option
                  v-for="vehicle in vehicleOptions.filter(v => v.type === type)"
                  :key="vehicle.value"
                  :label="`${vehicle.label} (${vehicle.type})`"
                  :value="vehicle.value"
                />
              </el-option-group>
              <!-- 没有车辆类型的车辆 -->
              <el-option-group label="其他车辆" v-if="vehicleOptions.some(v => !v.type)">
                <el-option
                  v-for="vehicle in vehicleOptions.filter(v => !v.type)"
                  :key="vehicle.value"
                  :label="`${vehicle.label} (无类型)`"
                  :value="vehicle.value"
                />
              </el-option-group>
            </el-select>
            <!-- 已选择的车辆列表 -->
            <div v-if="arrangeForm.vehicles.length > 0" class="selected-staff-list">
              <div class="selected-staff-header">
                <div class="staff-name">车牌号</div>
                <div class="staff-phone">车辆类型</div>
                <div class="staff-action">操作</div>
              </div>
              <div v-for="(vehicleValue, index) in arrangeForm.vehicles" :key="vehicleValue" class="selected-staff-item">
                <div class="staff-name">{{ getVehiclePlate(vehicleValue) }}</div>
                <div class="staff-phone">{{ getVehicleType(vehicleValue) }}</div>
                <div class="staff-action">
                  <el-button type="danger" size="small" @click="removeVehicle(index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          
          <!-- 外聘司机及车辆 -->
          <el-form-item label="外聘司机及车辆">
            <div class="external-drivers-section">
              <el-button type="primary" size="small" @click="addExternalDriver">添加</el-button>
              <div v-if="arrangeForm.externalDrivers.length > 0" class="selected-staff-list">
                <div class="selected-staff-header">
                  <div class="staff-name">姓名</div>
                  <div class="staff-phone">联系方式</div>
                  <div class="staff-license">车牌号</div>
                  <div class="staff-action">操作</div>
                </div>
                <div v-for="(driver, index) in arrangeForm.externalDrivers" :key="index" class="selected-staff-item">
                  <div class="staff-name">
                    <el-input v-model="driver.name" placeholder="请输入姓名" />
                  </div>
                  <div class="staff-phone">
                    <el-input v-model="driver.phone" placeholder="请输入联系方式" />
                  </div>
                  <div class="staff-license">
                    <el-input v-model="driver.licensePlate" placeholder="请输入车牌号" />
                  </div>
                  <div class="staff-action">
                    <el-button type="danger" size="small" @click="removeExternalDriver(index)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          
          <!-- 客户信息 -->
          <el-form-item label="客户姓名">
            <el-input v-model="arrangeForm.customer_name" disabled />
          </el-form-item>
          <el-form-item label="客户联系方式1">
            <el-input v-model="arrangeForm.customer_phone1" disabled />
          </el-form-item>
          <el-form-item label="客户联系方式2">
            <el-input v-model="arrangeForm.customer_phone2" disabled />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="arrangeForm.address" disabled />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input type="textarea" v-model="arrangeForm.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showArrangeDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmArrange">确认安排</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useOrderStore } from '../store/order';
import { staffApi, vehicleApi, staffArrangementApi } from '../api';
import type { Order } from '../types';

const router = useRouter();
const orderStore = useOrderStore();

const loading = ref(false);
const orders = ref<Order[]>([]);
const showArrangeDialog = ref(false);
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
  customer_phone: '',
  status: ''
});

// 人员安排表单
const arrangeForm = reactive({
  order_number: '',
  feast_time: '',
  feast_time_date: null, // 存储宴席时间的日期对象
  departure_time: '',
  arrival_time: '',
  chefs: [],
  waiters: [],
  drivers: [],
  vehicles: [],
  externalDrivers: [],
  customer_name: '',
  customer_phone1: '',
  customer_phone2: '',
  address: '',
  remark: ''
});

// 服务员选项
const waiterOptions = ref([]);

// 厨师选项
const chefOptions = ref([]);

// 司机选项
const driverOptions = ref([]);

// 获取人员数据
const fetchStaffData = async () => {
  try {
    const response = await staffApi.getStaffList();
    const staffList = response.data;
    
    // 按职位筛选人员
    chefOptions.value = staffList
      .filter((staff: any) => staff.position === '厨师')
      .map((staff: any) => ({
        value: staff.id,
        label: staff.name,
        phone: staff.phone
      }));
    
    waiterOptions.value = staffList
      .filter((staff: any) => staff.position === '服务员')
      .map((staff: any) => ({
        value: staff.id,
        label: staff.name,
        phone: staff.phone
      }));
    
    driverOptions.value = staffList
      .filter((staff: any) => staff.position === '司机')
      .map((staff: any) => ({
        value: staff.id,
        label: staff.name,
        phone: staff.phone
      }));
  } catch (error) {
    console.error('获取人员数据失败:', error);
  }
};

// 车辆选项
const vehicleOptions = ref([]);

// 车辆类型
const vehicleTypes = ref<string[]>([]);

// 获取车辆数据
const fetchVehicleData = async () => {
  try {
    const response = await vehicleApi.getVehicles();
    const vehicleList = response.data;
    
    // 转换为下拉选项所需的格式
    vehicleOptions.value = vehicleList.map((vehicle: any) => ({
      value: vehicle.id,
      label: vehicle.plateNumber,
      type: vehicle.type
    }));
    
    // 提取所有唯一的车辆类型
    const types = new Set(vehicleList.map((vehicle: any) => vehicle.type));
    vehicleTypes.value = Array.from(types);
  } catch (error) {
    console.error('获取车辆数据失败:', error);
  }
};

onMounted(async () => {
  await fetchOrders();
  await fetchStaffData();
  await fetchVehicleData();
});

const fetchOrders = async (params?: string) => {
  loading.value = true;
  try {
    await orderStore.fetchOrders(params);
    orders.value = orderStore.orders.filter(order => order.status !== -1);
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
  
  if (searchForm.status) {
    params.append('status', searchForm.status);
  }
  
  await fetchOrders(params.toString());
};

const resetForm = () => {
  searchForm.order_number = '';
  searchForm.feast_time_range = [];
  searchForm.customer_name = '';
  searchForm.customer_phone = '';
  searchForm.status = '';
  currentPage.value = 1;
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

const arrangeStaff = async (order: Order) => {
  // 填充基本信息
  arrangeForm.order_number = order.order_number;
  arrangeForm.feast_time = formatDateTime(order.feast_time);
  arrangeForm.feast_time_date = new Date(order.feast_time);
  arrangeForm.customer_name = order.customer_name;
  arrangeForm.customer_phone1 = order.customer_phone || '';
  arrangeForm.customer_phone2 = order.customer_phone2 || '';
  arrangeForm.address = `${order.region || ''} ${order.service_address || ''}`;
  
  try {
      // 尝试获取已有的人员安排信息
      const response = await staffArrangementApi.getStaffArrangement(order.id);
      const arrangement = response.data;
      
      // 填充已安排的信息
      arrangeForm.departure_time = arrangement.departure_time;
      arrangeForm.arrival_time = arrangement.arrival_time;
      arrangeForm.chefs = arrangement.chefs;
      arrangeForm.waiters = arrangement.waiters;
      arrangeForm.drivers = arrangement.drivers;
      arrangeForm.vehicles = arrangement.vehicles;
      arrangeForm.externalDrivers = arrangement.externalDrivers || [];
      arrangeForm.remark = arrangement.remark;
    } catch (error) {
      // 如果没有人员安排，重置表单
      arrangeForm.departure_time = '';
      arrangeForm.arrival_time = '';
      arrangeForm.chefs = [];
      arrangeForm.waiters = [];
      arrangeForm.drivers = [];
      arrangeForm.vehicles = [];
      arrangeForm.externalDrivers = [];
      arrangeForm.remark = '';
    }
  
  showArrangeDialog.value = true;
};

// 获取人员姓名
const getStaffName = (value: number, type: string) => {
  if (type === 'chef') {
    const chef = chefOptions.value.find(item => item.value === value);
    return chef ? chef.label : value.toString();
  } else if (type === 'waiter') {
    const waiter = waiterOptions.value.find(item => item.value === value);
    return waiter ? waiter.label : value.toString();
  } else if (type === 'driver') {
    const driver = driverOptions.value.find(item => item.value === value);
    return driver ? driver.label : value.toString();
  }
  return value.toString();
};

// 获取人员手机号
const getStaffPhone = (value: number, type: string) => {
  if (type === 'chef') {
    const chef = chefOptions.value.find(item => item.value === value);
    return chef ? chef.phone || '无电话' : '无电话';
  } else if (type === 'waiter') {
    const waiter = waiterOptions.value.find(item => item.value === value);
    return waiter ? waiter.phone || '无电话' : '无电话';
  } else if (type === 'driver') {
    const driver = driverOptions.value.find(item => item.value === value);
    return driver ? driver.phone || '无电话' : '无电话';
  }
  return '无电话';
};

// 移除已选择的人员
const removeStaff = (type: string, index: number) => {
  if (type === 'chefs') {
    arrangeForm.chefs.splice(index, 1);
  } else if (type === 'waiters') {
    arrangeForm.waiters.splice(index, 1);
  } else if (type === 'drivers') {
    arrangeForm.drivers.splice(index, 1);
  }
};

// 获取车辆车牌号
const getVehiclePlate = (value: number) => {
  const vehicle = vehicleOptions.value.find(item => item.value === value);
  return vehicle ? vehicle.label : value.toString();
};

// 获取车辆类型
const getVehicleType = (value: number) => {
  const vehicle = vehicleOptions.value.find(item => item.value === value);
  return vehicle ? vehicle.type || '未知类型' : '未知类型';
};

// 移除已选择的车辆
const removeVehicle = (index: number) => {
  arrangeForm.vehicles.splice(index, 1);
};

// 添加外聘司机
const addExternalDriver = () => {
  arrangeForm.externalDrivers.push({
    name: '',
    phone: '',
    licensePlate: ''
  });
};

// 移除外聘司机
const removeExternalDriver = (index: number) => {
  arrangeForm.externalDrivers.splice(index, 1);
};

const confirmArrange = async () => {
  try {
    // 查找当前订单
    const currentOrder = orders.value.find(order => order.order_number === arrangeForm.order_number);
    if (!currentOrder) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 校验出发时间和到达时间
    if (!arrangeForm.departure_time) {
      ElMessage.error('请选择出发时间');
      return;
    }
    if (!arrangeForm.arrival_time) {
      ElMessage.error('请选择到达时间');
      return;
    }
    
    const departureTime = new Date(arrangeForm.departure_time);
    const arrivalTime = new Date(arrangeForm.arrival_time);
    const feastTime = arrangeForm.feast_time_date;
    
    if (departureTime > feastTime) {
      ElMessage.error('出发时间不能晚于宴席时间');
      return;
    }
    if (arrivalTime > feastTime) {
      ElMessage.error('到达时间不能晚于宴席时间');
      return;
    }
    if (departureTime > arrivalTime) {
      ElMessage.error('出发时间不能晚于到达时间');
      return;
    }
    
    // 准备保存数据
    const saveData = {
      order_id: currentOrder.id,
      chefs: arrangeForm.chefs,
      waiters: arrangeForm.waiters,
      drivers: arrangeForm.drivers,
      vehicles: arrangeForm.vehicles,
      externalDrivers: arrangeForm.externalDrivers,
      departure_time: arrangeForm.departure_time,
      arrival_time: arrangeForm.arrival_time,
      remark: arrangeForm.remark
    };
    
    // 调用API保存人员安排
    await staffArrangementApi.saveStaffArrangement(saveData);
    
    ElMessage.success('人员安排保存成功');
    showArrangeDialog.value = false;
    
    // 刷新订单列表，更新人员安排状态
    await fetchOrders();
  } catch (error) {
    console.error('保存人员安排失败:', error);
    ElMessage.error('保存人员安排失败');
  }
};

const printOrder = async (orderId: number) => {
  try {
    // 获取订单信息
    const order = orders.value.find(o => o.id === orderId);
    if (!order) {
      ElMessage.error('找不到对应的订单');
      return;
    }
    
    // 检查订单状态，如果是未安排，弹出提示框
    if (order.status < 2) {
      ElMessage.warning('请先进行人员安排');
      return;
    }
    
    // 获取人员安排信息
    const response = await staffArrangementApi.getStaffArrangement(orderId);
    const arrangement = response.data;
    
    // 生成打印内容
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #333;">订单人员安排信息</h1>
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
        
        <h2 style="color: #444; margin-top: 30px;">订单基本信息</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 20%;">订单编号：</td>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;">${order.order_number}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 20%;">客户名称：</td>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;">${order.customer_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">客户电话：</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
              ${order.customer_phone}<br>
              ${order.customer_phone2 || '无'}
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">宴席时间：</td>
            <td style="padding: 8px; border: 1px solid #ddd; vertical-align: top;">${formatDateTime(order.feast_time)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">正式桌：</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.formal_tables}</td>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">备用桌：</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.backup_tables}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">套餐标准：</td>
            <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">${order.set_meal?.name || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">酒席类型：</td>
            <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">${order.feast_type || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">详细地址：</td>
            <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">${order.region} ${order.service_address}</td>
          </tr>
        </table>
        
        <h2 style="color: #444; margin-top: 30px;">人员安排信息</h2>
        
        <h3 style="color: #555; margin-top: 20px;">厨师</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">姓名</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">联系方式</th>
          </tr>
          ${arrangement.chefs && arrangement.chefs.length > 0 ? arrangement.chefs.map((chefId: number) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffName(chefId, 'chef')}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffPhone(chefId, 'chef')}</td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;" colspan="2">未安排</td>
            </tr>
          `}
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">服务员</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">姓名</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">联系方式</th>
          </tr>
          ${arrangement.waiters && arrangement.waiters.length > 0 ? arrangement.waiters.map((waiterId: number) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffName(waiterId, 'waiter')}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffPhone(waiterId, 'waiter')}</td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;" colspan="2">未安排</td>
            </tr>
          `}
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">司机</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">姓名</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">联系方式</th>
          </tr>
          ${arrangement.drivers && arrangement.drivers.length > 0 ? arrangement.drivers.map((driverId: number) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffName(driverId, 'driver')}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${getStaffPhone(driverId, 'driver')}</td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;" colspan="2">未安排</td>
            </tr>
          `}
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">车辆</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">车牌号</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">车辆类型</th>
          </tr>
          ${arrangement.vehicles && arrangement.vehicles.length > 0 ? arrangement.vehicles.map((vehicleId: number) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${getVehiclePlate(vehicleId)}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${getVehicleType(vehicleId)}</td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;" colspan="2">未安排</td>
            </tr>
          `}
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">外聘司机及车辆</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">姓名</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">联系方式</th>
            <th style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left;">车牌号</th>
          </tr>
          ${arrangement.externalDrivers && arrangement.externalDrivers.length > 0 ? arrangement.externalDrivers.map((driver: any) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${driver.name || '无'}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${driver.phone || '无'}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${driver.licensePlate || '无'}</td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;" colspan="3">未安排</td>
            </tr>
          `}
        </table>
        
        <h3 style="color: #555; margin-top: 20px;">备注</h3>
        <div style="padding: 10px; border: 1px solid #ddd; margin: 10px 0;">
          ${arrangement.remark || '无'}
        </div>
        
        <div style="margin-top: 40px; text-align: right; font-style: italic; color: #666;">
          打印时间：${new Date().toLocaleString('zh-CN')}
        </div>
      </div>
    `;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>订单人员安排打印</title></head><body>');
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
.order-staff-arrangement {
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

.order-staff-arrangement-content {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.arrange-dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 已选择人员列表样式 */
.selected-staff-list {
  margin-top: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.selected-staff-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e4e7ed;
}

.selected-staff-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
  align-items: center;
}

.selected-staff-item:last-child {
  border-bottom: none;
}

.staff-name {
  flex: 1;
  padding: 0 10px;
  text-align: center;
}

.staff-phone {
  flex: 1;
  padding: 0 10px;
  text-align: center;
}

.staff-license {
  flex: 1;
  padding: 0 10px;
  text-align: center;
}

.staff-action {
  flex: 0 0 100px;
  text-align: center;
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

:deep(.el-table .recent-days-row) {
  --el-table-tr-bg-color: #fdf6ec;
}

:deep(.el-table .recent-days-row:hover > td) {
  --el-table-tr-bg-color: #faecd8 !important;
}
</style>