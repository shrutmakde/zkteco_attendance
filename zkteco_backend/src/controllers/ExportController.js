const ExcelJS = require('exceljs');
const { Transaction } = require('../models/transaction/Transaction.js');
const { Employee } = require('../models/employee/Employee.js');
const { Device } = require('../models/device/Device.js');
const { Op } = require('sequelize');

exports.exportEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Fetch employee details
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Build query conditions
    const where = {
      employeeId,
      ...(startDate && endDate && {
        timestamp: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      })
    };

    // Fetch transactions
    const transactions = await Transaction.findAll({
      where,
      include: [
        { model: Device, attributes: ['deviceName', 'location'] }
      ],
      order: [['timestamp', 'ASC']]
    });

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Records');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Location', key: 'location', width: 20 }
    ];

    // Style the headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    // Add data rows
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      worksheet.addRow({
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        type: transaction.type,
        device: transaction.Device.deviceName,
        location: transaction.Device.location
      });
    });

    // Add summary section
    const summaryRow = worksheet.addRow([]);
    summaryRow.getCell(1).value = 'Summary';
    summaryRow.getCell(1).font = { bold: true };

    const totalRecords = transactions.length;
    const checkIns = transactions.filter(t => t.type === 'Check-in').length;
    const checkOuts = transactions.filter(t => t.type === 'Check-out').length;

    worksheet.addRow(['Total Records:', totalRecords]);
    worksheet.addRow(['Check-ins:', checkIns]);
    worksheet.addRow(['Check-outs:', checkOuts]);

    // Set response headers for Excel file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${employee.fullName}_attendance.xlsx`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting attendance:', error);
    res.status(500).json({ error: 'Failed to export attendance records' });
  }
}; 