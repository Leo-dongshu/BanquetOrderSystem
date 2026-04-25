<template>
  <div class="create-order">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建订单</span>
        </div>
      </template>
      <div class="create-order-content">
        <el-form :model="orderForm" label-width="120px" @submit.prevent="submitOrder">
          <el-form-item label="订单编号" required>
            <el-input v-model="orderForm.order_number" placeholder="系统自动生成" disabled />
          </el-form-item>

          <el-form-item label="选择套餐" required>
            <el-select v-model="orderForm.set_meal_id" placeholder="请选择套餐" @change="handleSetMealChange" :class="{ 'error-input': formErrors.set_meal_id }">
              <el-option v-for="setMeal in setMeals" :key="setMeal.id" :label="setMeal.name" :value="setMeal.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐信息" required>
            <div class="meal-info-table">
              <el-table :data="[{}]" style="width: 100%" :fit="true" v-if="orderForm.set_meal_id">
                <el-table-column label="宴席时间" min-width="180" align="center">
                  <template #default>
                    <el-date-picker
                      v-model="orderForm.feast_time"
                      type="datetime"
                      placeholder="选择宴席时间"
                      style="width: 100%"
                      :disabled-date="disabledDate"
                      :class="{ 'error-input': formErrors.feast_time && !orderForm.feast_time }"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="正式桌" min-width="100" align="center">
                  <template #default>
                    <el-input-number 
                      v-model="orderForm.formal_tables" 
                      :min="0" 
                      placeholder="正式桌"
                      :class="{ 'error-input': formErrors.formal_tables && orderForm.formal_tables === 0 }"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="备用桌" min-width="100" align="center">
                  <template #default>
                    <el-input-number v-model="orderForm.backup_tables" :min="0" placeholder="备用桌" />
                  </template>
                </el-table-column>
                <el-table-column label="套餐价格" min-width="120" align="center">
                  <template #default>
                    <el-input v-model="orderForm.set_meal_price" placeholder="套餐价格" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120" align="center">
                  <template #default>
                    <el-button type="primary" size="small" @click="adjustDishes">菜品调整</el-button>
                  </template>
                </el-table-column>

              </el-table>
              <div v-else class="no-data">
                暂无数据，请先选择套餐
              </div>
            </div>
          </el-form-item>

          <el-form-item label="酒席类型" required>
            <el-select v-model="orderForm.feast_type" placeholder="请选择酒席类型" :class="{ 'error-input': formErrors.feast_type }">
              <el-option v-for="item in feastTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="预定天数" required>
            <el-input-number v-model="orderForm.booking_days" :min="1" placeholder="请输入预定天数" :class="{ 'error-input': formErrors.booking_days }" />
          </el-form-item>
          <el-form-item label="预付定金" required>
            <el-input-number v-model="orderForm.deposit" :min="0" :step="0.01" placeholder="请输入预付定金" :class="{ 'error-input': formErrors.deposit }" />
          </el-form-item>
          <el-form-item label="支付方式" required>
            <el-select v-model="orderForm.payment_method" placeholder="请选择支付方式" :class="{ 'error-input': formErrors.payment_method }">
              <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="客户姓名" required>
            <el-input v-model="orderForm.customer_name" placeholder="请输入客户姓名" :class="{ 'error-input': formErrors.customer_name }" />
          </el-form-item>
          <el-form-item label="客户联系方式1" required>
            <el-input v-model="orderForm.customer_phone" placeholder="请输入客户联系方式1" :class="{ 'error-input': formErrors.customer_phone }" />
            <div v-if="!isValidPhone(orderForm.customer_phone) && orderForm.customer_phone" class="error-message">
              请输入有效的电话号码
            </div>
          </el-form-item>
          <el-form-item label="客户联系方式2">
            <el-input v-model="orderForm.customer_phone2" placeholder="请输入客户联系方式2" />
            <div v-if="!isValidPhone(orderForm.customer_phone2) && orderForm.customer_phone2" class="error-message">
              请输入有效的电话号码
            </div>
          </el-form-item>
          
          <el-form-item label="区域" required>
            <el-cascader
              v-model="regionValue"
              :options="regionOptions"
              placeholder="请选择区域"
              @change="handleRegionChange"
              style="width: 100%"
              :class="{ 'error-input': formErrors.region }"
            />
          </el-form-item>
          <el-form-item label="具体地址" required>
            <el-input v-model="orderForm.service_address" placeholder="请输入具体地址" :class="{ 'error-input': formErrors.service_address }" />
          </el-form-item>
          <el-form-item label="了解渠道" required>
            <el-select v-model="orderForm.source" placeholder="请选择了解渠道" :class="{ 'error-input': formErrors.source }">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="接单人" required>
            <el-select v-model="orderForm.receiver_id" placeholder="请选择接单人" :class="{ 'error-input': formErrors.receiver_id }">
              <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="订单备注">
            <el-input type="textarea" v-model="orderForm.remark" placeholder="请输入订单备注" />
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit" :loading="loading">提交订单</el-button>
              <el-button @click="cancelCreateOrder">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>




  </div>

  <!-- 菜品调整对话框 -->
  <el-dialog
    v-model="showAdjustDialog"
    title="菜品调整"
    width="600px"
  >
    <div class="adjust-dishes-content">
      <div class="add-dish-section">
        <el-select
          v-model="selectedDishId"
          placeholder="选择需要添加的菜品"
          style="width: 100%"
          @change="handleDishSelect"
        >
          <el-option
            v-for="dish in allDishes"
            :key="dish.id"
            :label="dish.name"
            :value="dish.id"
          />
        </el-select>
      </div>
      <div class="dish-list-section">
        <el-table :data="adjustedDishes" style="width: 100%">
          <el-table-column prop="name" label="菜品名称" min-width="200" align="center" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeDish(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelAdjust">取消</el-button>
          <el-button type="primary" @click.native="confirmAdjust">确认</el-button>
        </span>
      </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../store/order';
import { useDishStore } from '../store/dish';
import { useSetMealStore } from '../store/setMeal';
import { categorySettingsApi, dishApi, staffApi } from '../api';
import type { Dish, SetMeal } from '../types';

const router = useRouter();
const orderStore = useOrderStore();
const dishStore = useDishStore();
const setMealStore = useSetMealStore();

const loading = ref(false);

const orderForm = reactive({
  order_number: '',
  customer_name: '',
  customer_phone: '',
  customer_phone2: '',
  service_address: '',
  service_date: '',
  region: '',
  source: '',
  receiver_id: undefined,
  set_meal_id: undefined,
  set_meal_name: '',
  set_meal_price: '',
  feast_time: '',
  feast_type: '',
  booking_days: 1,
  deposit: 0,
  payment_method: '',
  remark: '',
  formal_tables: 0,
  backup_tables: 0
});

// 表单验证标志
const formErrors = reactive({
  order_number: false,
  customer_name: false,
  customer_phone: false,
  service_address: false,
  region: false,
  source: false,
  receiver_id: false,
  set_meal_id: false,
  feast_time: false,
  feast_type: false,
  booking_days: false,
  deposit: false,
  payment_method: false,
  formal_tables: false
});

const setMeals = ref<SetMeal[]>([]);
const feastTypeOptions = ref<Array<{ value: string; label: string }>>([]);
const paymentMethodOptions = ref<Array<{ value: string; label: string }>>([]);
const sourceOptions = ref<Array<{ value: string; label: string }>>([]);
const users = ref<any[]>([]);
const regionValue = ref<string[]>([]);
const regionOptions = ref<Array<{
  value: string;
  label: string;
  children?: Array<{
    value: string;
    label: string;
    children?: Array<{
      value: string;
      label: string;
    }>;
  }>;
}>>([]);

// 菜品调整相关
const showAdjustDialog = ref(false);
const selectedDishId = ref<number>();
const allDishes = ref<Dish[]>([]);
const adjustedDishes = ref<Dish[]>([]);

// 套餐详细信息
const selectedSetMealInfo = ref<{
  id: number;
  name: string;
  price: number;
  dishes: Array<{ dish_id: number; quantity: number }>;
} | null>(null);

// 监听表单字段的变化，取消红色提醒
watch(() => orderForm.feast_time, (newValue) => {
  if (newValue) {
    formErrors.feast_time = false;
  }
});

watch(() => orderForm.formal_tables, (newValue) => {
  if (newValue > 0) {
    formErrors.formal_tables = false;
  }
});

watch(() => orderForm.customer_name, (newValue) => {
  if (newValue) {
    formErrors.customer_name = false;
  }
});

watch(() => orderForm.customer_phone, (newValue) => {
  if (newValue) {
    formErrors.customer_phone = false;
  }
});

watch(() => orderForm.service_address, (newValue) => {
  if (newValue) {
    formErrors.service_address = false;
  }
});

watch(() => orderForm.region, (newValue) => {
  if (newValue) {
    formErrors.region = false;
  }
});

watch(() => orderForm.source, (newValue) => {
  if (newValue) {
    formErrors.source = false;
  }
});

watch(() => orderForm.set_meal_id, (newValue) => {
  if (newValue !== undefined) {
    formErrors.set_meal_id = false;
  }
});

watch(() => orderForm.feast_type, (newValue) => {
  if (newValue) {
    formErrors.feast_type = false;
  }
});

watch(() => orderForm.booking_days, (newValue) => {
  if (newValue !== undefined) {
    formErrors.booking_days = false;
  }
});

watch(() => orderForm.deposit, (newValue) => {
  if (newValue !== undefined) {
    formErrors.deposit = false;
  }
});

watch(() => orderForm.payment_method, (newValue) => {
  if (newValue) {
    formErrors.payment_method = false;
  }
});

watch(() => orderForm.receiver_id, (newValue) => {
  if (newValue) {
    formErrors.receiver_id = false;
  }
});

onMounted(async () => {
  // 自动生成订单编号：年月日时分秒毫秒
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  orderForm.order_number = `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
  
  // 并行获取数据
  const [setMealsResponse, categorySettingsResponse, dishesResponse, usersResponse] = await Promise.all([
    setMealStore.fetchSetMeals(),
    categorySettingsApi.getCategorySettings(),
    dishApi.getDishes(),
    staffApi.getStaffList()
  ]);
  
  setMeals.value = setMealStore.setMeals;
  
  // 处理类别设置数据，过滤出酒席类型和支付方式的类别
  const categorySettings = categorySettingsResponse.data;
  feastTypeOptions.value = categorySettings
    .filter((item: any) => item.type === '酒席类型')
    .map((item: any) => ({ value: item.name, label: item.name }));
  
  paymentMethodOptions.value = categorySettings
    .filter((item: any) => item.type === '支付方式')
    .map((item: any) => ({ value: item.name, label: item.name }));
  
  // 处理了解渠道选项
  sourceOptions.value = categorySettings
    .filter((item: any) => item.type === '了解渠道')
    .map((item: any) => ({ value: item.name, label: item.name }));
  
  // 获取所有菜品
  allDishes.value = dishesResponse.data;
  
  // 获取所有用户
  users.value = usersResponse.data;
  
  // 初始化区域选项（省县市）- 只保留江西省
  regionOptions.value = [
    {
      value: '江西省',
      label: '江西省',
      children: [
        {
          value: '南昌市',
          label: '南昌市',
          children: [
            { value: '东湖区', label: '东湖区' },
            { value: '西湖区', label: '西湖区' },
            { value: '青云谱区', label: '青云谱区' },
            { value: '湾里区', label: '湾里区' },
            { value: '青山湖区', label: '青山湖区' },
            { value: '新建区', label: '新建区' },
            { value: '南昌县', label: '南昌县' },
            { value: '安义县', label: '安义县' },
            { value: '进贤县', label: '进贤县' }
          ]
        },
        {
          value: '九江市',
          label: '九江市',
          children: [
            { value: '浔阳区', label: '浔阳区' },
            { value: '濂溪区', label: '濂溪区' },
            { value: '柴桑区', label: '柴桑区' },
            { value: '武宁县', label: '武宁县' },
            { value: '修水县', label: '修水县' },
            { value: '永修县', label: '永修县' },
            { value: '德安县', label: '德安县' },
            { value: '都昌县', label: '都昌县' },
            { value: '湖口县', label: '湖口县' },
            { value: '彭泽县', label: '彭泽县' },
            { value: '瑞昌市', label: '瑞昌市' },
            { value: '共青城市', label: '共青城市' },
            { value: '庐山市', label: '庐山市' }
          ]
        },
        {
          value: '景德镇市',
          label: '景德镇市',
          children: [
            { value: '昌江区', label: '昌江区' },
            { value: '珠山区', label: '珠山区' },
            { value: '浮梁县', label: '浮梁县' },
            { value: '乐平市', label: '乐平市' }
          ]
        },
        {
          value: '萍乡市',
          label: '萍乡市',
          children: [
            { value: '安源区', label: '安源区' },
            { value: '湘东区', label: '湘东区' },
            { value: '莲花县', label: '莲花县' },
            { value: '上栗县', label: '上栗县' },
            { value: '芦溪县', label: '芦溪县' }
          ]
        },
        {
          value: '新余市',
          label: '新余市',
          children: [
            { value: '渝水区', label: '渝水区' },
            { value: '分宜县', label: '分宜县' }
          ]
        },
        {
          value: '鹰潭市',
          label: '鹰潭市',
          children: [
            { value: '月湖区', label: '月湖区' },
            { value: '余江区', label: '余江区' },
            { value: '贵溪市', label: '贵溪市' }
          ]
        },
        {
          value: '赣州市',
          label: '赣州市',
          children: [
            { value: '章贡区', label: '章贡区' },
            { value: '南康区', label: '南康区' },
            { value: '赣县区', label: '赣县区' },
            { value: '信丰县', label: '信丰县' },
            { value: '大余县', label: '大余县' },
            { value: '上犹县', label: '上犹县' },
            { value: '崇义县', label: '崇义县' },
            { value: '安远县', label: '安远县' },
            { value: '龙南县', label: '龙南县' },
            { value: '定南县', label: '定南县' },
            { value: '全南县', label: '全南县' },
            { value: '宁都县', label: '宁都县' },
            { value: '于都县', label: '于都县' },
            { value: '兴国县', label: '兴国县' },
            { value: '会昌县', label: '会昌县' },
            { value: '寻乌县', label: '寻乌县' },
            { value: '石城县', label: '石城县' },
            { value: '瑞金市', label: '瑞金市' }
          ]
        },
        {
          value: '宜春市',
          label: '宜春市',
          children: [
            { value: '袁州区', label: '袁州区' },
            { value: '奉新县', label: '奉新县' },
            { value: '万载县', label: '万载县' },
            { value: '上高县', label: '上高县' },
            { value: '宜丰县', label: '宜丰县' },
            { value: '靖安县', label: '靖安县' },
            { value: '铜鼓县', label: '铜鼓县' },
            { value: '丰城市', label: '丰城市' },
            { value: '樟树市', label: '樟树市' },
            { value: '高安市', label: '高安市' }
          ]
        },
        {
          value: '上饶市',
          label: '上饶市',
          children: [
            { value: '信州区', label: '信州区' },
            { value: '广丰区', label: '广丰区' },
            { value: '广信区', label: '广信区' },
            { value: '玉山县', label: '玉山县' },
            { value: '铅山县', label: '铅山县' },
            { value: '横峰县', label: '横峰县' },
            { value: '弋阳县', label: '弋阳县' },
            { value: '余干县', label: '余干县' },
            { value: '鄱阳县', label: '鄱阳县' },
            { value: '万年县', label: '万年县' },
            { value: '婺源县', label: '婺源县' },
            { value: '德兴市', label: '德兴市' }
          ]
        },
        {
          value: '吉安市',
          label: '吉安市',
          children: [
            { value: '吉州区', label: '吉州区' },
            { value: '青原区', label: '青原区' },
            { value: '吉安县', label: '吉安县' },
            { value: '吉水县', label: '吉水县' },
            { value: '峡江县', label: '峡江县' },
            { value: '新干县', label: '新干县' },
            { value: '永丰县', label: '永丰县' },
            { value: '泰和县', label: '泰和县' },
            { value: '遂川县', label: '遂川县' },
            { value: '万安县', label: '万安县' },
            { value: '安福县', label: '安福县' },
            { value: '永新县', label: '永新县' },
            { value: '井冈山市', label: '井冈山市' }
          ]
        },
        {
          value: '抚州市',
          label: '抚州市',
          children: [
            { value: '临川区', label: '临川区' },
            { value: '东乡区', label: '东乡区' },
            { value: '南城县', label: '南城县' },
            { value: '黎川县', label: '黎川县' },
            { value: '南丰县', label: '南丰县' },
            { value: '崇仁县', label: '崇仁县' },
            { value: '乐安县', label: '乐安县' },
            { value: '宜黄县', label: '宜黄县' },
            { value: '金溪县', label: '金溪县' },
            { value: '资溪县', label: '资溪县' },
            { value: '广昌县', label: '广昌县' }
          ]
        }
      ]
    }
  ];
});

const navigateTo = (path: string) => {
  router.push(path);
};

const handleSetMealChange = async (setMealId: number | undefined) => {
  if (setMealId) {
    const selectedSetMeal = setMeals.value.find(setMeal => setMeal.id === setMealId);
    if (selectedSetMeal) {
      orderForm.set_meal_id = setMealId;
      orderForm.set_meal_name = selectedSetMeal.name;
      orderForm.set_meal_price = selectedSetMeal.price.toString();
      
      // 存储套餐详细信息，包括菜品ID
      const dishes = selectedSetMeal.set_meal_dishes?.map(smd => ({
        dish_id: smd.dish_id || smd.dish?.id || smd.Dish?.id || 0,
        quantity: smd.quantity || 1
      })).filter(d => d.dish_id > 0) || [];
      
      selectedSetMealInfo.value = {
        id: selectedSetMeal.id,
        name: selectedSetMeal.name,
        price: selectedSetMeal.price,
        dishes: dishes
      };
      
      // 初始化调整后的菜品列表
      adjustedDishes.value = allDishes.value.filter(dish => 
        dishes.some(d => d.dish_id === dish.id)
      );
      
      // 当选择套餐后，设置宴席时间和正式桌为必填项，显示红色提醒
      formErrors.feast_time = true;
      formErrors.formal_tables = true;
      
      // 预存储菜品到订单菜品表
      try {
        // 这里需要调用后端API来预存储菜品
        // 由于我们还没有创建订单，所以需要一个临时的方式来存储
        // 暂时只在前端存储，等提交订单时一起保存
      } catch (error) {
        console.error('预存储菜品失败:', error);
      }
    } else {
      orderForm.set_meal_id = undefined;
      orderForm.set_meal_name = '';
      orderForm.set_meal_price = '';
      selectedSetMealInfo.value = null;
      adjustedDishes.value = [];
      // 重置表单验证标志
      formErrors.feast_time = false;
      formErrors.formal_tables = false;
    }
  } else {
    orderForm.set_meal_id = undefined;
    orderForm.set_meal_name = '';
    orderForm.set_meal_price = '';
    selectedSetMealInfo.value = null;
    adjustedDishes.value = [];
    // 重置表单验证标志
    formErrors.feast_time = false;
    formErrors.formal_tables = false;
  }
};

const handleRegionChange = (value: string[]) => {
  if (value && value.length > 0) {
    orderForm.region = value.join(' / ');
  } else {
    orderForm.region = '';
  }
};

const adjustDishes = async () => {
  // 打开菜品调整对话框
  showAdjustDialog.value = true;
  
  // 如果没有预存储的菜品列表，加载选择套餐的菜品列表
  if (adjustedDishes.value.length === 0 && orderForm.set_meal_id) {
    try {
      const setMeal = setMeals.value.find(sm => sm.id === orderForm.set_meal_id);
      if (setMeal && setMeal.set_meal_dishes) {
        // 提取套餐中的菜品
        const dishIds = setMeal.set_meal_dishes.map(smd => {
          if ('dish_id' in smd) return smd.dish_id;
          if (smd.dish) return smd.dish.id;
          if (smd.Dish) return smd.Dish.id;
          return 0;
        }).filter(id => id > 0);
        
        // 从所有菜品中筛选出套餐中的菜品
        adjustedDishes.value = allDishes.value.filter(dish => dishIds.includes(dish.id));
      }
    } catch (error) {
      console.error('获取套餐菜品失败:', error);
    }
  }
  // 否则，使用预存储的菜品列表
};

const handleDishSelect = (dishId: number) => {
  if (dishId) {
    // 查找选中的菜品
    const selectedDish = allDishes.value.find(dish => dish.id === dishId);
    if (selectedDish) {
      // 检查菜品是否已经在列表中
      const isExists = adjustedDishes.value.some(dish => dish.id === dishId);
      if (!isExists) {
        // 添加菜品到列表
        adjustedDishes.value.push(selectedDish);
      }
      // 清空选择
      selectedDishId.value = undefined;
    }
  }
};

const removeDish = (dishId: number) => {
  // 从列表中移除菜品
  adjustedDishes.value = adjustedDishes.value.filter(dish => dish.id !== dishId);
};

const cancelAdjust = () => {
  // 取消调整，关闭对话框
  showAdjustDialog.value = false;
  // 保留预存储的菜品列表，不重置
};

const confirmAdjust = () => {
  // 确认调整，关闭对话框
  showAdjustDialog.value = false;
  // 保存调整后的菜品列表
  console.log('调整后的菜品:', adjustedDishes.value);
  // 调整后的菜品列表会在提交订单时一起保存
};

const submitOrder = async () => {
  // 重置所有错误标志
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = false;
  });

  // 检查所有必填字段
  let hasError = false;
  
  if (!orderForm.order_number) {
    formErrors.order_number = true;
    hasError = true;
  }
  if (!orderForm.customer_name) {
    formErrors.customer_name = true;
    hasError = true;
  }
  if (!orderForm.customer_phone || !isValidPhone(orderForm.customer_phone)) {
    formErrors.customer_phone = true;
    hasError = true;
  }
  if (!orderForm.service_address) {
    formErrors.service_address = true;
    hasError = true;
  }
  if (!orderForm.region) {
    formErrors.region = true;
    hasError = true;
  }
  if (!orderForm.source) {
    formErrors.source = true;
    hasError = true;
  }
  if (orderForm.set_meal_id === undefined) {
    formErrors.set_meal_id = true;
    hasError = true;
  }
  if (!orderForm.feast_time) {
    formErrors.feast_time = true;
    hasError = true;
  }
  if (!orderForm.feast_type) {
    formErrors.feast_type = true;
    hasError = true;
  }
  if (orderForm.booking_days === undefined) {
    formErrors.booking_days = true;
    hasError = true;
  }
  if (orderForm.deposit === undefined) {
    formErrors.deposit = true;
    hasError = true;
  }
  if (!orderForm.payment_method) {
    formErrors.payment_method = true;
    hasError = true;
  }
  if (orderForm.formal_tables === undefined || orderForm.formal_tables === 0) {
    formErrors.formal_tables = true;
    hasError = true;
  }
  if (orderForm.receiver_id === undefined) {
    formErrors.receiver_id = true;
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    // 构建菜品数据
    const dishesData = adjustedDishes.value.map(dish => ({
      dish_id: dish.id,
      quantity: 1 // 默认为1，根据实际需求调整
    }));

    const orderData = {
      order_number: orderForm.order_number,
      customer_name: orderForm.customer_name,
      customer_phone: orderForm.customer_phone,
      customer_phone2: orderForm.customer_phone2,
      service_address: orderForm.service_address,
      service_date: orderForm.feast_time, // 使用宴席时间作为服务日期
      region: orderForm.region,
      source: orderForm.source,
      receiver_id: orderForm.receiver_id,
      set_meal_id: orderForm.set_meal_id,
      set_meal_price: orderForm.set_meal_price,
      feast_time: orderForm.feast_time,
      feast_type: orderForm.feast_type,
      booking_days: orderForm.booking_days,
      deposit: orderForm.deposit,
      payment_method: orderForm.payment_method,
      remark: orderForm.remark,
      formal_tables: orderForm.formal_tables,
      backup_tables: orderForm.backup_tables,
      dishes: dishesData
    };

    await orderStore.createOrder(orderData);
    router.push('/orders');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cancelCreateOrder = () => {
  // 取消创建订单，清空预存储的菜品信息
  adjustedDishes.value = [];
  selectedSetMealInfo.value = null;
  router.push('/orders');
};

const isValidPhone = (phone: string) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const disabledDate = (time: Date) => {
  // 禁用当天及之前的日期
  return time.getTime() <= Date.now();
};
</script>

<style scoped>
.create-order {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-order-content {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.meal-info-table {
  width: 100%;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: #f9f9f9;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  color: #909399;
  font-size: 14px;
}

.adjust-dishes-content {
  width: 100%;
}

.add-dish-section {
  margin-bottom: 20px;
}

.dish-list-section {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

/* 错误输入框样式 */
:deep(.error-input .el-input__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}

:deep(.error-input .el-input-number__decrease),
:deep(.error-input .el-input-number__increase) {
  border-color: #f56c6c !important;
}

:deep(.error-input .el-date-picker__input.el-input .el-input__wrapper) {
  border: 1px solid #f56c6c !important;
}

:deep(.error-input .el-select__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}

:deep(.error-input .el-cascader__wrapper) {
  border: 1px solid #f56c6c !important;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
}
</style>