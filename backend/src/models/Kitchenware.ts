import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Kitchenware extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public quantity!: number;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Kitchenware.init({
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
    type: DataTypes.STRING(50),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
  tableName: 'kitchenwares',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

<<<<<<< HEAD
export default Kitchenware;
=======
export default Kitchenware;
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d
