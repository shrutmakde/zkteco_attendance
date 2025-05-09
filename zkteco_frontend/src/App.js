import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import DeviceList from './components/DeviceList';
import AttendanceList from './components/AttendanceList';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App; 