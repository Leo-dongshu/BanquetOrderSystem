import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Dish extends Model {
  public id!: number;
  public name!: string;
  public dishware!: string;
  public cookingMethod!: string;
  public cookingDescription!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Dish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  dishware: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cookingMethod: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cookingDescription: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'dishes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Dish;