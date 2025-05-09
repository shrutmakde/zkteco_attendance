// Import necessary React hooks and Material-UI components
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon, People, DeviceHub, AccessTime, Assessment, DarkMode, LightMode } from '@mui/icons-material';

// Import application components
import EmployeeList from './components/EmployeeList';
import DeviceList from './components/DeviceList';
import AttendanceList from './components/AttendanceList';
import Reports from './components/Reports';
import './App.css';

// Define sidebar width constant
const drawerWidth = 240;

// Main application component
function App() {
  // State for sidebar and theme management
  const [open, setOpen] = useState(true);  // Controls sidebar visibility
  const [darkMode, setDarkMode] = useState(() => {
    // Get initial dark mode preference from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save dark mode preference to localStorage and update body background
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.style.backgroundColor = darkMode ? '#303030' : '#f5f5f5';
  }, [darkMode]);

  // Create theme configuration based on dark/light mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease',
          },
        },
      },
    },
  });

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Navigation menu items configuration
  const menuItems = [
    { text: 'Employees', icon: <People />, path: '/' },
    { text: 'Devices', icon: <DeviceHub />, path: '/devices' },
    { text: 'Attendance', icon: <AccessTime />, path: '/attendance' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          
          {/* Header/AppBar component */}
          <AppBar 
            position="fixed" 
            sx={{ 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              transition: 'background-color 0.3s ease',
            }}
          >
            <Toolbar>
              {/* Sidebar toggle button */}
              <IconButton
                color="inherit"
                onClick={() => setOpen(!open)}
                edge="start"
                sx={{ marginRight: 2 }}
              >
                <MenuIcon />
              </IconButton>
              {/* Application title */}
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                ZKTeco Attendance System
              </Typography>
              {/* Dark/Light mode toggle button */}
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Sidebar navigation drawer */}
          <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                marginTop: '64px',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            <List>
              {/* Render navigation menu items */}
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text} 
                  component="a" 
                  href={item.path}
                  sx={{
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Drawer>

          {/* Main content area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              marginTop: '64px',
              marginLeft: open ? `${drawerWidth}px` : 0,
              transition: theme =>
                theme.transitions.create(['margin', 'background-color'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            }}
          >
            {/* Application routes */}
            <Routes>
              <Route path="/" element={<EmployeeList />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
