const Transaction = require('../models/transaction/Transaction');
const Employee = require('../models/employee/Employee');
const Device = require('../models/device/Device');
const { Op } = require('sequelize');

async function generateDummyTransactions() {
  try {
    // Get all employees and devices
    const employees = await Employee.findAll();
    const devices = await Device.findAll();

    if (employees.length === 0) {
      console.error('No employees found. Please add employees first.');
      return;
    }

    if (devices.length === 0) {
      console.error('No devices found. Please add devices first.');
      return;
    }

    // Delete existing transactions for clean slate
    await Transaction.destroy({ where: {} });

    const transactions = [];
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Generate transactions for each employee
    for (const employee of employees) {
      // Generate transactions for each day in the past month
      for (let date = new Date(lastMonth); date <= now; date.setDate(date.getDate() + 1)) {
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
    await Transaction.bulkCreate(transactions);

    console.log(`Successfully generated ${transactions.length} dummy transactions`);
  } catch (error) {
    console.error('Error generating dummy transactions:', error);
  }
}

// Export for use in scripts
module.exports = generateDummyTransactions;

// If running directly, execute the seeder
if (require.main === module) {
  generateDummyTransactions()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 