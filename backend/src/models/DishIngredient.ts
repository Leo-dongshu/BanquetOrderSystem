import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Dish from './Dish';
import Ingredient from './Ingredient';

class DishIngredient extends Model {
  public id!: number;
  public dish_id!: number;
  public ingredient_id!: number;
  public quantity!: number;
  public readonly created_at!: Date;
  public ingredient?: any;
}

DishIngredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Dish,
      key: 'id'
    }
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ingredient,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'dish_ingredients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});



Dish.hasMany(DishIngredient, { foreignKey: 'dish_id', as: 'dish_ingredients' });
Ingredient.hasMany(DishIngredient, { foreignKey: 'ingredient_id' });
DishIngredient.belongsTo(Dish, { foreignKey: 'dish_id' });
DishIngredient.belongsTo(Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });

export default DishIngredient;