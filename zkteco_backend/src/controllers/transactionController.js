const Transaction = require('../models/transaction/Transaction');
const Employee = require('../models/employee/Employee');
const Device = require('../models/device/Device');
const { Op } = require('sequelize');

const transactionController = {
  // Get all transactions
  async getAllTransactions(req, res) {
    try {
      const { startDate, endDate, employeeId, deviceId } = req.query;
      
      const where = {};
      if (startDate && endDate) {
        where.dateTime = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      if (employeeId) where.employeeId = employeeId;
      if (deviceId) where.deviceId = deviceId;

      const transactions = await Transaction.findAll({
        where,
        include: [
          { model: Employee, attributes: ['fullName', 'employeeId', 'department'] },
          { model: Device, attributes: ['deviceName', 'location'] }
        ],
        order: [['dateTime', 'DESC']]
      });
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get transaction by ID
  async getTransactionById(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.params.id, {
        include: [
          { model: Employee, attributes: ['fullName', 'employeeId', 'department'] },
          { model: Device, attributes: ['deviceName', 'location'] }
        ]
      });
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Process attendance logs from device
  async processAttendanceLogs(req, res) {
    try {
      const { deviceId, logs } = req.body;
      
      if (!Array.isArray(logs)) {
        return res.status(400).json({ error: 'Invalid logs format' });
      }

      const processedLogs = [];
      for (const log of logs) {
        const { employeeId, dateTime, transactionType } = log;
        
        // Find employee by ID
        const employee = await Employee.findOne({ where: { employeeId } });
        if (!employee) {
          console.warn(`Employee not found: ${employeeId}`);
          continue;
        }

        // Create transaction
        const transaction = await Transaction.create({
          employeeId: employee.employeeId,
          deviceId,
          dateTime,
          transactionType,
          status: 'PROCESSED'
        });

        processedLogs.push(transaction);
      }

      res.json({
        message: 'Attendance logs processed successfully',
        processedCount: processedLogs.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get attendance summary
  async getAttendanceSummary(req, res) {
    try {
      const { startDate, endDate, employeeId } = req.query;
      
      const where = { status: 'PROCESSED' };
      if (startDate && endDate) {
        where.dateTime = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      if (employeeId) where.employeeId = employeeId;

      const transactions = await Transaction.findAll({
        where,
        include: [
          { 
            model: Employee, 
            attributes: ['fullName', 'employeeId', 'department'] 
          },
          {
            model: Device,
            attributes: ['deviceName', 'location']
          }
        ],
        order: [['dateTime', 'ASC']]
      });

      // Group transactions by employee and date
      const summary = {};
      transactions.forEach(transaction => {
        const date = transaction.dateTime.toISOString().split('T')[0];
        const employeeId = transaction.Employee.employeeId;
        
        if (!summary[employeeId]) {
          summary[employeeId] = {
            employee: {
              id: transaction.Employee.employeeId,
              name: transaction.Employee.fullName,
              department: transaction.Employee.department
            },
            dates: {}
          };
        }
        
        if (!summary[employeeId].dates[date]) {
          summary[employeeId].dates[date] = {
            firstIn: null,
            lastOut: null,
            firstInDevice: null,
            lastOutDevice: null,
            totalHours: 0
          };
        }
        
        const currentRecord = summary[employeeId].dates[date];
        
        if (transaction.transactionType === 'IN') {
          // Update first IN if not set or if this is earlier
          if (!currentRecord.firstIn || transaction.dateTime < new Date(currentRecord.firstIn)) {
            currentRecord.firstIn = transaction.dateTime;
            currentRecord.firstInDevice = {
              name: transaction.Device.deviceName,
              location: transaction.Device.location
            };
          }
        } else if (transaction.transactionType === 'OUT') {
          // Update last OUT if not set or if this is later
          if (!currentRecord.lastOut || transaction.dateTime > new Date(currentRecord.lastOut)) {
            currentRecord.lastOut = transaction.dateTime;
            currentRecord.lastOutDevice = {
              name: transaction.Device.deviceName,
              location: transaction.Device.location
            };
          }
        }
        
        // Calculate total hours if both IN and OUT exist
        if (currentRecord.firstIn && currentRecord.lastOut) {
          const hours = (new Date(currentRecord.lastOut) - new Date(currentRecord.firstIn)) / (1000 * 60 * 60);
          currentRecord.totalHours = Math.round(hours * 100) / 100;
        }
      });

      // Convert summary object to array and sort by date
      const summaryArray = Object.values(summary).map(employeeData => ({
        ...employeeData,
        dates: Object.entries(employeeData.dates)
          .map(([date, data]) => ({
            date,
            ...data
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      }));

      res.json(summaryArray);
    } catch (error) {
      console.error('Error in getAttendanceSummary:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = transactionController; 