import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DevicesOther as DevicesIcon,
  EventNote as AttendanceIcon,
  Assessment as ReportsIcon
} from '@mui/icons-material';

// Define sidebar width constant
const drawerWidth = 240;

// Navigation menu items configuration
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
  { text: 'Devices', icon: <DevicesIcon />, path: '/devices' },
  { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' }
];

// Sidebar component for navigation
const Sidebar = () => {
  // Get current location for active menu highlighting
  const location = useLocation();

  return (
    // Main drawer component
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Application title */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          ZKTeco Attendance
        </Typography>
      </Box>
      
      {/* Navigation menu list */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 