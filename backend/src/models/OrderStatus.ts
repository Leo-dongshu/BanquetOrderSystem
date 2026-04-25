import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderStatus extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrderStatus.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
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
  }
}, {
  sequelize,
  tableName: 'order_statuses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default OrderStatus;