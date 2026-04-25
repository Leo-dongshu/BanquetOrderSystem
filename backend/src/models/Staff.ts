import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Staff extends Model {
  public id!: number;
  public name!: string;
  public gender!: string;
  public age!: number;
  public phone!: string;
  public position!: string;
  public positionType!: string;
  public registrationTime!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    positionType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registrationTime: {
      type: DataTypes.DATEONLY,
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
  },
  {
    sequelize,
    tableName: 'staff',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Staff;