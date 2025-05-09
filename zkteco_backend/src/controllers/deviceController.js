const Device = require('../models/device/Device');
const { ZKTeco } = require('../services/zkteco');

const deviceController = {
  // Get all devices
  async getAllDevices(req, res) {
    try {
      const devices = await Device.findAll();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get device by ID
  async getDeviceById(req, res) {
    try {
      const device = await Device.findByPk(req.params.id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new device
  async createDevice(req, res) {
    try {
      const device = await Device.create(req.body);
      res.status(201).json(device);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update device
  async updateDevice(req, res) {
    try {
      const device = await Device.findByPk(req.params.id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      await device.update(req.body);
      res.json(device);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete device
  async deleteDevice(req, res) {
    try {
      const device = await Device.findByPk(req.params.id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      await device.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Sync device data
  async syncDevice(req, res) {
    try {
      const device = await Device.findByPk(req.params.id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      const zk = new ZKTeco(device.ipAddress, device.port);
      await zk.connect();
      
      // Get attendance logs
      const logs = await zk.getAttendance();
      
      // Update last sync time
      await device.update({ lastSync: new Date() });
      
      res.json({ 
        message: 'Device synced successfully',
        logs: logs
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = deviceController; 