import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class DishIngredient extends Model {
  public id!: number;
  public dish_id!: number;
  public ingredient_id!: number;
  public quantity!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

DishIngredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'dish_ingredients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default DishIngredient;