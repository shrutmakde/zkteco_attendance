const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction routes
router.get('/summary', transactionController.getAttendanceSummary);
router.post('/process', transactionController.processAttendanceLogs);
router.get('/', transactionController.getAllTransactions);
router.get('/:id([0-9]+)', transactionController.getTransactionById);

module.exports = router; 