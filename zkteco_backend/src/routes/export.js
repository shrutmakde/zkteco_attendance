const express = require('express');
const router = express.Router();
const { exportEmployeeAttendance } = require('../controllers/ExportController');

router.get('/employee-attendance', exportEmployeeAttendance);
 
module.exports = router; 