import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

// DeviceList component for managing biometric devices
const DeviceList = () => {
  // State management for devices, dialog, and form data
  const [devices, setDevices] = useState([]);  // Stores list of devices
  const [open, setOpen] = useState(false);     // Controls dialog visibility
  const [selectedDevice, setSelectedDevice] = useState(null);  // Currently selected device for edit
  const [formData, setFormData] = useState({   // Form data for add/edit device
    deviceName: '',
    deviceType: '',
    deviceModel: '',
    serialNumber: '',
    ipAddress: '',
    macAddress: '',
    location: '',
    comPortProtocol: '',
    switchPort: '',
    deviceStatus: 'Active',
    enrollmentDate: '',
    firmwareVersion: '',
    lastMaintenanceDate: ''
  });

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Fetch devices from the backend API
  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  // Handle opening the device form dialog for editing
  const handleEdit = (device) => {
    setSelectedDevice(device);
    setFormData({
      deviceName: device.deviceName || '',
      deviceType: device.deviceType || '',
      deviceModel: device.deviceModel || '',
      serialNumber: device.serialNumber || '',
      ipAddress: device.ipAddress || '',
      macAddress: device.macAddress || '',
      location: device.location || '',
      comPortProtocol: device.comPortProtocol || '',
      switchPort: device.switchPort || '',
      deviceStatus: device.deviceStatus || 'Active',
      enrollmentDate: device.enrollmentDate ? format(new Date(device.enrollmentDate), 'yyyy-MM-dd') : '',
      firmwareVersion: device.firmwareVersion || '',
      lastMaintenanceDate: device.lastMaintenanceDate ? format(new Date(device.lastMaintenanceDate), 'yyyy-MM-dd') : ''
    });
    setOpen(true);
  };

  // Handle device deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await axios.delete(`http://localhost:3000/api/devices/${id}`);
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  // Handle form submission for adding/editing devices
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDevice) {
        await axios.put(`http://localhost:3000/api/devices/${selectedDevice.deviceId}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/devices', formData);
      }
      setOpen(false);
      fetchDevices();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form data to initial state
  const resetForm = () => {
    setSelectedDevice(null);
    setFormData({
      deviceName: '',
      deviceType: '',
      deviceModel: '',
      serialNumber: '',
      ipAddress: '',
      macAddress: '',
      location: '',
      comPortProtocol: '',
      switchPort: '',
      deviceStatus: 'Active',
      enrollmentDate: '',
      firmwareVersion: '',
      lastMaintenanceDate: ''
    });
  };

  // Render the device management interface
  return (
    <Box 
      sx={{ 
        p: 2,
        maxWidth: 'calc(100vw - 280px)',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        ml: -1
      }}
    >
      {/* Header section with title and add button */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Typography variant="h4" component="h1">
          Devices
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Add Device
        </Button>
      </Box>

      {/* Devices table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          width: '100%',
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            px: 1.5,
            py: 1
          },
          '& .MuiTable-root': {
            minWidth: 1200
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>MAC Address</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Firmware Version</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render device rows */}
            {devices.map((device) => (
              <TableRow key={device.deviceId} hover>
                <TableCell>{device.deviceId}</TableCell>
                <TableCell>{device.deviceName}</TableCell>
                <TableCell>{device.deviceType}</TableCell>
                <TableCell>{device.deviceModel}</TableCell>
                <TableCell>{device.serialNumber}</TableCell>
                <TableCell>{device.ipAddress}</TableCell>
                <TableCell>{device.macAddress}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Chip 
                    label={device.deviceStatus} 
                    color={device.deviceStatus === 'Active' ? 'success' : 'error'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{device.enrollmentDate ? format(new Date(device.enrollmentDate), 'dd/MM/yyyy') : ''}</TableCell>
                <TableCell>{device.firmwareVersion}</TableCell>
                <TableCell>{device.lastMaintenanceDate ? format(new Date(device.lastMaintenanceDate), 'dd/MM/yyyy') : ''}</TableCell>
                <TableCell>{device.createdAt ? format(new Date(device.createdAt), 'dd/MM/yyyy HH:mm') : ''}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(device)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(device.deviceId)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDevice ? 'Edit Device' : 'Add Device'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <TextField
                name="deviceName"
                label="Device Name"
                value={formData.deviceName}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="deviceType"
                label="Device Type"
                value={formData.deviceType}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="deviceModel"
                label="Device Model"
                value={formData.deviceModel}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="serialNumber"
                label="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="ipAddress"
                label="IP Address"
                value={formData.ipAddress}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="macAddress"
                label="MAC Address"
                value={formData.macAddress}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="deviceStatus"
                label="Status"
                value={formData.deviceStatus}
                onChange={handleChange}
                required
                select
                fullWidth
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                name="enrollmentDate"
                label="Enrollment Date"
                type="date"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="firmwareVersion"
                label="Firmware Version"
                value={formData.firmwareVersion}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="lastMaintenanceDate"
                label="Last Maintenance Date"
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedDevice ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DeviceList; 