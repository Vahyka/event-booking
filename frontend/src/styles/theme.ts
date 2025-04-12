import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#cd4545',    
      contrastText: '#fff', 
    },
    secondary: {
      main: '#f16821',    
      light: '#E5BEEC',    
    },
    background: {
      default: '#e6dedd',
      paper: '#ffffff',   
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2A2F4F'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '1rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '12px 24px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease'
        }
      }
    }
  }
});

export default theme;