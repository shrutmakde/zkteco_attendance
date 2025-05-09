// Import necessary React hooks and Material-UI components
import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

// Reports component for generating and viewing attendance reports
const Reports = () => {
  // State management for report generation
  const [employees, setEmployees] = useState([]);  // List of employees
  const [selectedEmployee, setSelectedEmployee] = useState('');  // Selected employee ID
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);  // Selected month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  // Selected year
  const [report, setReport] = useState(null);  // Generated report data
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error message

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch list of employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    }
  };

  // Generate monthly attendance report
  const generateReport = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/reports/monthly', {
        params: {
          employeeId: selectedEmployee,
          month: selectedMonth,
          year: selectedYear
        }
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Download report as CSV file
  const downloadReport = () => {
    if (!report) return;

    // Define CSV headers
    const headers = ['Date', 'First In', 'First In Location', 'Last Out', 'Last Out Location', 'Hours Worked'];
    
    // Format report data for CSV
    const rows = report.dailyRecords.map(record => [
      format(new Date(record.date), 'dd/MM/yyyy'),
      record.firstIn ? format(new Date(record.firstIn), 'HH:mm:ss') : '-',
      record.firstInDevice ? record.firstInDevice.location : '-',
      record.lastOut ? format(new Date(record.lastOut), 'HH:mm:ss') : '-',
      record.lastOutDevice ? record.lastOutDevice.location : '-',
      record.duration ? `${record.duration} hours` : '-'
    ]);

    // Create CSV content with title and employee details
    const title = `Attendance Report - ${report.employee.name} - ${format(new Date(report.year, report.month - 1), 'MMMM yyyy')}`;
    const csvContent = [
      title,
      '',
      'Employee Details:',
      `Name: ${report.employee.name}`,
      `Department: ${report.employee.department}`,
      `Employee ID: ${report.employee.id}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.csv`;
    link.click();
  };

  // Month and year options for selection
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Render the reports interface
  return (
    <Box sx={{ p: 3 }}>
      {/* Report title */}
      <Typography variant="h4" gutterBottom>
        Monthly Attendance Report
      </Typography>

      {/* Report filters and actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Employee selection */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            label="Employee"
          >
            {employees.map((employee) => (
              <MenuItem key={employee.employeeId} value={employee.employeeId}>
                {employee.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Month selection */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
          >
            {months.map((month, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year selection */}
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Generate report button */}
        <Button variant="contained" onClick={generateReport} disabled={loading}>
          Generate Report
        </Button>

        {/* Download report button */}
        {report && (
          <Button variant="outlined" onClick={downloadReport} disabled={loading}>
            Download CSV
          </Button>
        )}
      </Box>

      {/* Error message display */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Report display */}
      {report && !loading && (
        <Box>
          {/* Report header with employee details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">
              {report.employee.name} - {report.employee.department}
            </Typography>
            <Typography variant="subtitle1">
              {format(new Date(report.year, report.month - 1), 'MMMM yyyy')}
            </Typography>
          </Box>

          {/* Report table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>First In</TableCell>
                  <TableCell>First In Location</TableCell>
                  <TableCell>Last Out</TableCell>
                  <TableCell>Last Out Location</TableCell>
                  <TableCell>Hours Worked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.dailyRecords.map((record) => (
                  <TableRow key={record.date}>
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
                      {record.duration ? `${record.duration} hours` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Reports; 