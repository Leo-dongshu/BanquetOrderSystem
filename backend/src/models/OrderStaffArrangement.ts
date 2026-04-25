import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class OrderStaffArrangement extends Model {
  public id!: number;
  public order_id!: number;
  public chefs!: string;
  public waiters!: string;
  public drivers!: string;
  public vehicles!: string;
  public externalDrivers!: string;
  public departure_time!: Date;
  public arrival_time!: Date;
  public remark!: string;
  public createdBy!: string;
  public updatedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

<<<<<<< HEAD
OrderStaffArrangement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    chefs: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    waiters: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    drivers: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vehicles: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    externalDrivers: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'order_staff_arrangements',
    timestamps: true,
    underscored: true,
  }
);
=======
OrderStaffArrangement.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  chefs: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  waiters: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  drivers: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vehicles: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  externalDrivers: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  departure_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  arrival_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'order_staff_arrangements',
  timestamps: true,
  underscored: true
});
>>>>>>> 9625cf02ebc61d1105e524ea062b1861859de93d

export default OrderStaffArrangement;