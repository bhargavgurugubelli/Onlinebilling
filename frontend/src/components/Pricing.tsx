import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PricingPlan {
  title: string;
  price: number;
  currency: string;
  features: { name: string }[];
  planId: string;
}

const Pricing = (): JSX.Element => {
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    axios
      .get<PricingPlan[]>(`${baseUrl}pricing`)
      .then((res) => setPricing(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handlePayClick = (planId: string, planName: string, amount: number) => {
    // ✅ Store correct keys expected in Pay.tsx
    localStorage.setItem('pendingPlanId', planId);
    localStorage.setItem('pendingPlanName', planName);
    localStorage.setItem('pendingAmount', amount.toString());

    const mobile = localStorage.getItem('new_user_mobile');

    if (mobile) {
      navigate('/pay');
    } else {
      navigate('/signup', {
        state: {
          planId,
          planName,
          amount,
        },
      });
    }
  };

  return (
    <div id="pricing">
      <Box sx={{ pt: 6, pb: 10, px: 2, backgroundColor: '#f3f0ff' }}>
        <Box mb={4}>
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom sx={{ textTransform: 'uppercase' }}>
            Pricing
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Choose a plan that works for you
          </Typography>
        </Box>

        <Container>
          <Grid container spacing={4} justifyContent="center">
            {pricing.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ position: 'relative' }}>
                  {index === 1 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ffc107',
                      color: '#000',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      zIndex: 1,
                    }}>
                      Most Popular
                    </Box>
                  )}

                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    borderTop: '6px solid #28a745',
                    p: 3,
                    backgroundColor: '#fff',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.12)',
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h6" align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="h3" align="center" sx={{ color: '#28a745', fontWeight: 800, fontSize: '2.5rem' }}>
                        {item.currency}{item.price}
                      </Typography>
                      <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                        per month
                      </Typography>
                      <Box>
                        {item.features.map((feature, idx) => (
                          <Typography key={idx} align="center" variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                            • {feature.name}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>

                    <Box flexGrow={1} />
                    <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
                      <button
                        onClick={() => handlePayClick(item.planId, item.title, item.price)}
                        style={{
                          padding: '8px 16px',
                          background: '#D82C4E',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Pay ₹{item.price}
                      </button>
                    </CardActions>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Pricing;
