import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 56,
          height: 56,
        }}
      >
        <CircularProgress
          size={56}
          thickness={3}
          sx={{
            color: '#4F46E5',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.3)', opacity: 0.5 },
              },
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: '#94A3B8',
          fontWeight: 500,
          fontSize: '0.85rem',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
