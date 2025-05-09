const Transaction = require('../models/transaction/Transaction');
const Employee = require('../models/employee/Employee');
const Device = require('../models/device/Device');
const { Op } = require('sequelize');

const reportController = {
  async getMonthlyReport(req, res) {
    try {
      const { employeeId, month, year } = req.query;

      if (!employeeId || !month || !year) {
        return res.status(400).json({ error: 'Employee ID, month, and year are required' });
      }

      // Create date range for the specified month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

      // Get employee details
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Get all transactions for the employee in the specified month
      const transactions = await Transaction.findAll({
        where: {
          employeeId,
          dateTime: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          { model: Device, attributes: ['deviceName', 'location'] }
        ],
        order: [['dateTime', 'ASC']]
      });

      // Process transactions to get daily summary
      const dailySummary = {};
      transactions.forEach(transaction => {
        const date = transaction.dateTime.toISOString().split('T')[0];
        
        if (!dailySummary[date]) {
          dailySummary[date] = {
            date,
            firstIn: null,
            lastOut: null,
            duration: null,
            device: null
          };
        }

        if (transaction.transactionType === 'IN') {
          if (!dailySummary[date].firstIn || transaction.dateTime < dailySummary[date].firstIn) {
            dailySummary[date].firstIn = transaction.dateTime;
            dailySummary[date].firstInDevice = transaction.Device;
          }
        } else if (transaction.transactionType === 'OUT') {
          if (!dailySummary[date].lastOut || transaction.dateTime > dailySummary[date].lastOut) {
            dailySummary[date].lastOut = transaction.dateTime;
            dailySummary[date].lastOutDevice = transaction.Device;
          }
        }
      });

      // Calculate duration for each day
      Object.values(dailySummary).forEach(day => {
        if (day.firstIn && day.lastOut) {
          const duration = (new Date(day.lastOut) - new Date(day.firstIn)) / (1000 * 60 * 60); // in hours
          day.duration = Math.round(duration * 100) / 100; // Round to 2 decimal places
        }
      });

      const report = {
        employee: {
          id: employee.employeeId,
          name: employee.fullName,
          department: employee.department
        },
        month: month,
        year: year,
        dailyRecords: Object.values(dailySummary)
      };

      res.json(report);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }
};

module.exports = reportController; 