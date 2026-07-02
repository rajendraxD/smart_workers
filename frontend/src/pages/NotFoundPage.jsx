import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: (theme) => `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[200]} 100%)`,
      p: 2,
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          py: 8,
          px: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}>
          <SearchOffIcon sx={{ fontSize: 80, color: 'grey.400' }} />
          <Typography variant="h1" fontWeight={900} color="primary" sx={{ fontSize: { xs: '5rem', sm: '7rem' }, lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 360 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ mt: 2, px: 5, py: 1.5, borderRadius: 2 }}>
            Go Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
