require('dotenv').config();

const Transaction = require('../models/transaction/Transaction');
const Employee = require('../models/employee/Employee');
const Device = require('../models/device/Device');
const { Op } = require('sequelize');

async function generateAdditionalTransactions() {
  try {
    // Get all employees and devices
    const employees = await Employee.findAll();
    const devices = await Device.findAll();

    if (employees.length === 0 || devices.length === 0) {
      console.error('No employees or devices found. Please add them first.');
      return;
    }

    // Find the last transaction date
    const lastTransaction = await Transaction.findOne({
      order: [['dateTime', 'DESC']]
    });

    const startDate = lastTransaction 
      ? new Date(lastTransaction.dateTime)
      : new Date(new Date().setMonth(new Date().getMonth() - 1));
    
    startDate.setDate(startDate.getDate() + 1); // Start from the next day
    const today = new Date();

    console.log(`Generating transactions from ${startDate.toISOString()} to ${today.toISOString()}`);

    const transactions = [];

    // Generate transactions for each employee
    for (const employee of employees) {
      // Generate transactions for each day from last transaction to today
      for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Random device for each day
        const device = devices[Math.floor(Math.random() * devices.length)];

        // Generate check-in time (between 8:45 AM and 9:15 AM)
        const checkInTime = new Date(date);
        checkInTime.setHours(8 + Math.floor(Math.random() * 1));
        checkInTime.setMinutes(45 + Math.floor(Math.random() * 30));

        // Generate check-out time (between 5:00 PM and 6:00 PM)
        const checkOutTime = new Date(date);
        checkOutTime.setHours(17 + Math.floor(Math.random() * 1));
        checkOutTime.setMinutes(Math.floor(Math.random() * 60));

        // 10% chance of being absent
        if (Math.random() > 0.1) {
          transactions.push({
            employeeId: employee.employeeId,
            deviceId: device.deviceId,
            dateTime: checkInTime,
            transactionType: 'IN',
            status: 'PROCESSED',
            createdAt: new Date(),
            updatedAt: new Date()
          });

          transactions.push({
            employeeId: employee.employeeId,
            deviceId: device.deviceId,
            dateTime: checkOutTime,
            transactionType: 'OUT',
            status: 'PROCESSED',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        // 5% chance of having a mid-day punch (lunch break, meeting, etc.)
        if (Math.random() < 0.05) {
          const midDayOutTime = new Date(date);
          midDayOutTime.setHours(12);
          midDayOutTime.setMinutes(Math.floor(Math.random() * 60));

          const midDayInTime = new Date(midDayOutTime);
          midDayInTime.setHours(13);
          midDayInTime.setMinutes(Math.floor(Math.random() * 60));

          transactions.push({
            employeeId: employee.employeeId,
            deviceId: device.deviceId,
            dateTime: midDayOutTime,
            transactionType: 'OUT',
            status: 'PROCESSED',
            createdAt: new Date(),
            updatedAt: new Date()
          });

          transactions.push({
            employeeId: employee.employeeId,
            deviceId: device.deviceId,
            dateTime: midDayInTime,
            transactionType: 'IN',
            status: 'PROCESSED',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    // Bulk insert all transactions
    if (transactions.length > 0) {
      await Transaction.bulkCreate(transactions);
      console.log(`Successfully generated ${transactions.length} additional transactions`);
    } else {
      console.log('No new transactions needed - already up to date');
    }
  } catch (error) {
    console.error('Error generating additional transactions:', error);
  }
}

// Export for use in scripts
module.exports = generateAdditionalTransactions;

// If running directly, execute the seeder
if (require.main === module) {
  generateAdditionalTransactions()
    .then(() => {
      console.log('Additional seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Additional seeding failed:', error);
      process.exit(1);
    });
} 