import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3366ff',
      light: '#5b85ff',
      dark: '#274bdb',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a470ff',
      dark: '#5725b6',
    },
    background: {
      default: '#eef4ff',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ffb020',
    },
    error: {
      main: '#ef5350',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.4rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
    },
    body1: {
      lineHeight: 1.6,
      fontSize: '0.97rem',
    },
    body2: {
      lineHeight: 1.6,
      fontSize: '0.88rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          boxShadow: 'none',
          padding: '10px 18px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 10px 26px rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(145, 158, 171, 0.16)',
          padding: '16px 18px',
        },
        head: {
          backgroundColor: '#f5f8ff',
          color: '#344054',
          fontWeight: 700,
          letterSpacing: '0.04em',
        },
      },
    },
  },
});