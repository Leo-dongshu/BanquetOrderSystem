import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderStatusHistory extends Model {
  public id!: number;
  public order_id!: number;
  public status_id!: number;
  public created_by!: string;
  public readonly created_at!: Date;
}

OrderStatusHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'order_statuses',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'order_status_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

<<<<<<< HEAD
// 关联关系将在需要时通过其他方式处理

=======
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
export default OrderStatusHistory;