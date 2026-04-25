import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import SetMeal from './SetMeal';
import Dish from './Dish';

class SetMealDish extends Model {
  public id!: number;
  public set_meal_id!: number;
  public dish_id!: number;
  public quantity!: number;
  public readonly created_at!: Date;
}

SetMealDish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  set_meal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SetMeal,
      key: 'id'
    },
    onDelete: 'CASCADE'
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
    allowNull: false,
    defaultValue: 1
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'set_meal_dishes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 设置关联关系
SetMeal.hasMany(SetMealDish, { foreignKey: 'set_meal_id', as: 'set_meal_dishes' });
SetMealDish.belongsTo(SetMeal, { foreignKey: 'set_meal_id' });
Dish.hasMany(SetMealDish, { foreignKey: 'dish_id' });
SetMealDish.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

export default SetMealDish;
