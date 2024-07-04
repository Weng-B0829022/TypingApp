import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Controller from './Controller'
import AdminPage from './pages/AdminPage'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#26A69A', 
    },
    secondary:{
      main: '#E87356',
    },
    white:{
      main: '#ffffff',
    },
    black:{
      main: '#000000',
    },
    background: {
      default: '#E0E0E0',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#26A69A',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#26A69A',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#26A69A',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButtonBase-root:focus': {
            outline: 'none',
          },
          '&.Mui-focusVisible': {
            outline: 'none',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Controller />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App