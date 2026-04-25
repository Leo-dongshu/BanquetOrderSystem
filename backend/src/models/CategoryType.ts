import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class CategoryType extends Model {
  public id!: number;
  public name!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CategoryType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '类型名称（如：用餐类型）'
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
  tableName: 'category_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default CategoryType;