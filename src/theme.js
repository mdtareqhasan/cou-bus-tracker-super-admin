import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      dark: '#3730A3',
      light: '#818CF8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4',
      dark: '#0891B2',
      light: '#67E8F9',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#059669' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#DC2626' },
    info: { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB' },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: 'rgba(0,0,0,0.06)',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 700, letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, letterSpacing: '-0.015em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    caption: { color: '#94A3B8' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
    '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
    '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
    '0 25px 50px -12px rgba(0,0,0,0.1)',
    ...Array(19).fill('0 25px 50px -12px rgba(0,0,0,0.1)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,0,0,0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 2,
          padding: '10px 14px',
          transition: 'all 0.15s ease',
        },
      },
    },
  },
});

export default theme;
