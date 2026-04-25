import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Vehicle extends Model {
  public id!: number;
  public plateNumber!: string;
  public type!: string;
  public brand!: string;
  public status!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'vehicles',
    timestamps: true,
    underscored: true,
  }
);

export default Vehicle;