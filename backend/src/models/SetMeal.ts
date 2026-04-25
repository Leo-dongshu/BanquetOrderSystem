import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class SetMeal extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public price!: number;
  public description!: string;
  public dishCount!: number;
  public isVisible!: boolean;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SetMeal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dishCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'set_meals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default SetMeal;
