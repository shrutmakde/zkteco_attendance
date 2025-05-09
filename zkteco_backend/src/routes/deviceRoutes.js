const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Device routes
router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.post('/:id/sync', deviceController.syncDevice);

module.exports = router; 