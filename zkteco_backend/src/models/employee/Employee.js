const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Employee = sequelize.define('Employee', {
  employeeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'employeeId'
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'fullName'
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'department'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Active',
    field: 'status'
  },
  employeeRole: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'employeeRole'
  },
  card_no: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'card_no'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'email'
  },
  mobileNumber: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'mobileNumber'
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'gender'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'dateOfBirth'
  },
  dateofJoined: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'dateofJoined'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'address'
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
  tableName: 'employees',
  timestamps: true,
  underscored: false
});

module.exports = Employee; 