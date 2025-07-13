import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

type SummaryData = {
  total_invoices: number;
  total_amount: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('has_paid');
    localStorage.removeItem('new_user_mobile');
    localStorage.removeItem('pendingPlanId');
    localStorage.removeItem('pendingPlanName');
    localStorage.removeItem('pendingAmount');

    window.location.href = 'http://localhost:8000/accounts/logout/';
  };

  // ✅ Fetch Summary Only If User Has Paid
  useEffect(() => {
    const hasPaid = localStorage.getItem('has_paid');
    const token = localStorage.getItem('access_token');

    if (hasPaid !== 'true' || !token) {
      window.location.href = '/pricing-table';
      return;
    }

    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/sales/summary/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to load summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Welcome back 👋</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Let’s grow your food business today!
      </Typography>

      {/* Loading Spinner */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#e6f4ea',
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 2,
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Total Invoices
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {summary?.total_invoices ?? 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#fff3e6',
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 2,
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  ₹{summary?.total_amount.toFixed(2) ?? '0.00'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => (window.location.href = '/sales/create')}
              >
                + Create Invoice
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => (window.location.href = '/upload-menu')}
              >
                Upload Menu PDF
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => (window.location.href = '/search-items')}
              >
                Search Items
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
