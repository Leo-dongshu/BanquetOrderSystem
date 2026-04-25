import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
  public id!: number;
  public order_number!: string;
  public customer_name!: string;
  public customer_phone!: string;
  public customer_phone2!: string;
  public service_address!: string;
  public service_date!: Date;
  public region!: string;
  public source!: string;
  public receiver_id!: number;
  public set_meal_id!: number;
  public feast_time!: Date;
  public feast_type!: string;
  public booking_days!: number;
  public deposit!: number;
  public paid_amount!: number;
  public payment_method!: string;
  public remark!: string;
  public formal_tables!: number;
  public backup_tables!: number;
  public total_amount!: number;
  public discount_amount!: number;
  public status!: number;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  customer_phone2: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  service_address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  service_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'id'
    }
  },
  set_meal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'set_meals',
      key: 'id'
    }
  },
  feast_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  feast_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  booking_days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paid_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  formal_tables: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  backup_tables: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'order_statuses',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: 'NOW'
  },
  createdBy: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 关联关系
import SetMeal from './SetMeal';
import OrderStatus from './OrderStatus';
import Staff from './Staff';
import OrderStatusHistory from './OrderStatusHistory';

// 订单关联套餐
Order.belongsTo(SetMeal, {
  foreignKey: 'set_meal_id',
  as: 'set_meal'
});

// 订单关联状态
Order.belongsTo(OrderStatus, {
  foreignKey: 'status',
  as: 'order_status'
});

// 订单关联接单人
Order.belongsTo(Staff, {
  foreignKey: 'receiver_id',
  as: 'receiver'
});

// 订单关联状态历史
Order.hasMany(OrderStatusHistory, {
  foreignKey: 'order_id',
  as: 'status_history'
});

export default Order;