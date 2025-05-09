const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Device = sequelize.define('Device', {
  deviceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'deviceId'
  },
  deviceName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'deviceName'
  },
  deviceType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'deviceType'
  },
  deviceModel: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'deviceModel'
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'serialNumber'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ipAddress'
  },
  macAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'macAddress'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location'
  },
  comPortProtocol: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'comPortProtocol'
  },
  switchPort: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'switchPort'
  },
  deviceStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Active',
    field: 'deviceStatus'
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'enrollmentDate'
  },
  firmwareVersion: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'firmwareVersion'
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'lastMaintenanceDate'
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
  tableName: 'devices',
  timestamps: true,
  underscored: false
});

module.exports = Device; 