import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Order from './Order';
import SetMeal from './SetMeal';

class OrderSetMeal extends Model {
  public id!: number;
  public order_id!: number;
  public set_meal_id!: number;
  public readonly created_at!: Date;
}

OrderSetMeal.init({
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
    },
    onDelete: 'CASCADE'
  },
  set_meal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SetMeal,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'order_set_meals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});



Order.hasMany(OrderSetMeal, { foreignKey: 'order_id', as: 'order_set_meals' });
OrderSetMeal.belongsTo(Order, { foreignKey: 'order_id' });
SetMeal.hasMany(OrderSetMeal, { foreignKey: 'set_meal_id' });
OrderSetMeal.belongsTo(SetMeal, { foreignKey: 'set_meal_id', as: 'set_meal' });

export default OrderSetMeal;