// Import necessary React hooks and Material-UI components for building the attendance list interface
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';  // Date picker component for selecting date ranges
import axios from 'axios';  // HTTP client for making API requests
import { format } from 'date-fns';  // Date formatting utility

// Main AttendanceList component that displays and manages attendance records
const AttendanceList = () => {
  // State management for data and UI
  const [transactions, setTransactions] = useState([]);    // Store raw attendance records
  const [summary, setSummary] = useState([]);             // Store summarized attendance data
  const [loading, setLoading] = useState(true);           // Track loading state for UI feedback
  const [startDate, setStartDate] = useState(null);       // Start date for filtering
  const [endDate, setEndDate] = useState(null);           // End date for filtering
  const [employeeId, setEmployeeId] = useState('');       // Selected employee for filtering
  const [deviceId, setDeviceId] = useState('');           // Selected device for filtering
  const [employees, setEmployees] = useState([]);         // List of all employees
  const [devices, setDevices] = useState([]);             // List of all devices
  const [view, setView] = useState('list');               // Current view mode (list/summary)
  const [error, setError] = useState(null);               // Error message state

  // Initial data loading when component mounts
  useEffect(() => {
    fetchData();          // Load attendance data
    fetchEmployees();     // Load employee list
    fetchDevices();       // Load device list
  }, []);

  // Fetch attendance data with current filters
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters from current filters
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (employeeId) params.append('employeeId', employeeId);
      if (deviceId) params.append('deviceId', deviceId);

      let transactionsData = [];
      let summaryData = [];

      // Fetch detailed transactions from the API
      try {
        const transactionsRes = await axios.get(`http://localhost:3000/api/transactions?${params}`);
        transactionsData = transactionsRes.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
      }

      // Fetch summary data from the API
      try {
        const summaryRes = await axios.get(`http://localhost:3000/api/transactions/summary?${params}`);
        summaryData = summaryRes.data;
      } catch (error) {
        console.error('Error fetching summary:', error);
        setError(prev => prev ? `${prev}. Failed to fetch summary` : 'Failed to fetch summary');
      }

      // Update state with fetched data
      setTransactions(transactionsData);
      setSummary(Array.isArray(summaryData) ? summaryData : []);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of all employees for the filter dropdown
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    }
  };

  // Fetch list of all devices for the filter dropdown
  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices');
    }
  };

  // Handle filter application when user clicks the Filter button
  const handleFilter = () => {
    fetchData();
  };

  // Reset all filters to their default values and refresh data
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setEmployeeId('');
    setDeviceId('');
    fetchData();
  };

  // Render the detailed view table showing individual attendance records
  const renderDetailedView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Device ID</TableCell>
            <TableCell>Device Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through transactions to display individual records */}
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.Employee?.employeeId}</TableCell>
              <TableCell>{transaction.Employee?.fullName}</TableCell>
              <TableCell>{transaction.Device?.deviceId}</TableCell>
              <TableCell>{transaction.Device?.deviceName}</TableCell>
              <TableCell>{format(new Date(transaction.dateTime), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{format(new Date(transaction.dateTime), 'HH:mm:ss')}</TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render the summary view table showing daily attendance summaries
  const renderSummaryView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>First In</TableCell>
            <TableCell>First In Location</TableCell>
            <TableCell>Last Out</TableCell>
            <TableCell>Last Out Location</TableCell>
            <TableCell>Total Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through summary data to display daily records for each employee */}
          {summary.map((employeeData) => (
            employeeData.dates.map((record) => (
              <TableRow key={`${employeeData.employee.id}-${record.date}`}>
                <TableCell>{employeeData.employee.name}</TableCell>
                <TableCell>{employeeData.employee.department}</TableCell>
                <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  {record.firstIn ? format(new Date(record.firstIn), 'HH:mm:ss') : '-'}
                </TableCell>
                <TableCell>
                  {record.firstInDevice ? record.firstInDevice.location : '-'}
                </TableCell>
                <TableCell>
                  {record.lastOut ? format(new Date(record.lastOut), 'HH:mm:ss') : '-'}
                </TableCell>
                <TableCell>
                  {record.lastOutDevice ? record.lastOutDevice.location : '-'}
                </TableCell>
                <TableCell>
                  {record.totalHours ? `${record.totalHours} hours` : '-'}
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Tabs value={view} onChange={(e, newValue) => setView(newValue)}>
          <Tab label="Detailed View" value="list" />
          <Tab label="Summary View" value="summary" />
        </Tabs>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              label="Employee"
            >
              <MenuItem value="">All</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.employeeId} value={employee.employeeId}>
                  {employee.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Device</InputLabel>
            <Select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              label="Device"
            >
              <MenuItem value="">All</MenuItem>
              {devices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.deviceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={handleFilter} disabled={loading}>
            Filter
          </Button>
          <Button variant="outlined" onClick={handleClearFilters} disabled={loading}>
            Clear
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : view === 'list' ? (
        renderDetailedView()
      ) : (
        renderSummaryView()
      )}
    </Box>
  );
};

export default AttendanceList; 