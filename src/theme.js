import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d64c2',
      dark: '#20146B',
      light: '#5BA4FB',
    },
    secondary: {
      main: '#19D0D8',
    },
    background: {
      default: '#F6F9FE',
      paper: '#FFFFFF',
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 9,
          paddingBottom: 9,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
        },
      },
    },
  },
});

export default theme;
