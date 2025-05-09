import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'

const theme = createTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
    <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
)
