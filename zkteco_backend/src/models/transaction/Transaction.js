const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Employee = require('../employee/Employee');
const Device = require('../device/Device');

const Transaction = sequelize.define('Transaction', {
  transactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'transactionId'
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employeeId',
    references: {
      model: 'employees',
      key: 'employeeId'
    }
  },
  deviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'deviceId',
    references: {
      model: 'devices',
      key: 'deviceId'
    }
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'transactionType'
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'dateTime'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'status'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt'
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: false
});

// Define associations
Transaction.belongsTo(Employee, { foreignKey: 'employeeId' });
Transaction.belongsTo(Device, { foreignKey: 'deviceId' });

module.exports = Transaction; 