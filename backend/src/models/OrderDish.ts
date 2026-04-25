import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Order from './Order';
import Dish from './Dish';

class OrderDish extends Model {
  public id!: number;
  public order_id!: number;
  public dish_id!: number;
  public quantity!: number;
  public readonly created_at!: Date;
}

OrderDish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Dish,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'order_dishes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 设置关联关系
Order.hasMany(OrderDish, { foreignKey: 'order_id', as: 'order_dishes' });
Dish.hasMany(OrderDish, { foreignKey: 'dish_id' });
OrderDish.belongsTo(Order, { foreignKey: 'order_id' });
OrderDish.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

export default OrderDish;