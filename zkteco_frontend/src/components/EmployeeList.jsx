// Import necessary React hooks and Material-UI components
import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// EmployeeList component for managing employee records
function EmployeeList() {
  // State management for employees, loading state, dialog, and form data
  const [employees, setEmployees] = useState([]);  // Stores list of employees
  const [loading, setLoading] = useState(false);   // Loading state indicator
  const [open, setOpen] = useState(false);        // Controls dialog visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null);  // Currently selected employee for edit
  const [formData, setFormData] = useState({      // Form data for add/edit employee
    fullName: '',
    department: '',
    employeeRole: '',
    status: 'Active',
    card_no: '',
    email: '',
    mobileNumber: '',
    gender: '',
    dateOfBirth: '',
    dateofJoined: '',
    address: '',
  });
  const [error, setError] = useState('');         // Error message state

  // Fetch employees from the backend API
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      console.log('Fetched employees:', data); // Debug log
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle opening the employee form dialog
  const handleOpen = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData(employee);
    } else {
      setSelectedEmployee(null);
      setFormData({
        fullName: '',
        department: '',
        employeeRole: '',
        status: 'Active',
        card_no: '',
        email: '',
        mobileNumber: '',
        gender: '',
        dateOfBirth: '',
        dateofJoined: '',
        address: '',
      });
    }
    setOpen(true);
  };

  // Handle closing the employee form dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  // Handle form submission for adding/editing employees
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedEmployee
        ? `http://localhost:3000/api/employees/${selectedEmployee.employeeId}`
        : 'http://localhost:3000/api/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleClose();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  // Handle employee deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/employees/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchEmployees();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Render the employee management interface
  return (
    <div>
      {/* Header card with title and action buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Employee Management
            </Typography>
            <Box>
              {/* Refresh button */}
              <Tooltip title="Refresh">
                <IconButton onClick={fetchEmployees} sx={{ mr: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {/* Add employee button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
              >
                Add Employee
              </Button>
            </Box>
          </Box>
          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {/* Loading indicator */}
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {/* Employees table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Card No</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Empty state or loading message */}
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      {loading ? 'Loading...' : 'No employees found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employeeId} hover>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.employeeRole}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.status}
                          color={employee.status === 'Active' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{employee.card_no}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.mobileNumber}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(employee)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(employee.employeeId)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '47%' },
              mt: 2,
            }}
          >
            <TextField
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
            <TextField
              label="Department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />
            <TextField
              label="Role"
              value={formData.employeeRole}
              onChange={(e) =>
                setFormData({ ...formData, employeeRole: e.target.value })
              }
              required
            />
            <FormControl sx={{ m: 1, width: '47%' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                label="Status"
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Card No"
              value={formData.card_no}
              onChange={(e) =>
                setFormData({ ...formData, card_no: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextField
              label="Phone"
              value={formData.mobileNumber}
              onChange={(e) =>
                setFormData({ ...formData, mobileNumber: e.target.value })
              }
              required
            />
            <FormControl sx={{ m: 1, width: '47%' }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                label="Gender"
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Date Joined"
              type="date"
              value={formData.dateofJoined}
              onChange={(e) =>
                setFormData({ ...formData, dateofJoined: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
              sx={{ width: '96%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedEmployee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EmployeeList; 