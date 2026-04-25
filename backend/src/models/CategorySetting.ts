import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CategorySetting extends Model {
  public id!: number;
  public type!: string;
  public name!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CategorySetting.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '类别类型: meal_type-用餐类型, service_type-服务类型, order_type-订单类型'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  createdBy: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'system'
  },
  updatedBy: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'system'
  }
}, {
  sequelize,
  tableName: 'category_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default CategorySetting;