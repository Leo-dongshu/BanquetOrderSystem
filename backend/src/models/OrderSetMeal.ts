import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderSetMeal extends Model {
  public id!: number;
  public order_id!: number;
  public set_meal_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrderSetMeal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  set_meal_id: {
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
  tableName: 'order_set_meals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default OrderSetMeal;