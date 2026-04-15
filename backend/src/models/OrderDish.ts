import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderDish extends Model {
  public id!: number;
  public order_id!: number;
  public dish_id!: number;
  public quantity!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrderDish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: 'NOW'
  }
}, {
  sequelize,
  tableName: 'order_dishes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default OrderDish;