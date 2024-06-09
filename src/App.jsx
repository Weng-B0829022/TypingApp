import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import BasicInfo from './pages/BasicInfo'
import ModePage from './pages/ModePage'
import QuestionPage from './pages/QuestionPage'
import ResultPage from './pages/ResultPage'
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
    
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BasicInfo/>
      <ModePage/>
      <QuestionPage/>
      <ResultPage/>
    </ThemeProvider>
  )
}

export default App
