import React, { useState, useEffect } from 'react';
import {
  Drawer, Box, Typography, IconButton, TextField, Button, Divider, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileOtpDrawer: React.FC<Props> = ({ open, onClose }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobile) return;
    try {
      await axios.post('http://127.0.0.1:8000/api/send-otp/', { mobile });
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      console.error('Failed to send OTP:', err);
      alert('Failed to send OTP. Try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!mobile) return;
    try {
      await axios.post('http://127.0.0.1:8000/api/send-otp/', { mobile });
      setResendTimer(60);
    } catch (err) {
      console.error('Resend failed:', err);
      alert('Could not resend OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !mobile) return;
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/verify-otp/', {
        mobile,
        otp,
      });

      if (res.data.existing_user) {
        // ✅ Existing user → Save token and mark as paid
        localStorage.setItem('access_token', res.data.token.access);
        localStorage.setItem('refresh_token', res.data.token.refresh);
        localStorage.setItem('has_paid', 'true'); // ✅ Key fix here
        navigate('/dashboard');
      } else {
        // 🆕 New user → Save mobile to localStorage
        localStorage.setItem('new_user_mobile', mobile);
        navigate('/pricing-table');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      alert('Invalid OTP. Try again.');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, otpSent]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '460px' } }}>
      <Box sx={{ px: 4, pt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>Login / Register</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mt={4}>
          <Typography variant="body2" gutterBottom>
            Enter your mobile number
          </Typography>
          <TextField
            fullWidth
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
          />

          {!otpSent && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendOtp}
              sx={{ mt: 2, backgroundColor: '#D82C4E' }}
            >
              Get OTP
            </Button>
          )}

          {otpSent && (
            <>
              <TextField
                fullWidth
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
              />

              <Box mt={1.5}>
                {resendTimer > 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    You can request another OTP in <strong>{resendTimer}</strong> seconds
                  </Typography>
                ) : (
                  <Button onClick={handleResendOtp} sx={{ color: '#D82C4E' }}>
                    Resend OTP
                  </Button>
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOtp}
                sx={{ mt: 2, backgroundColor: '#D82C4E' }}
              >
                Login
              </Button>
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }}>Or</Divider>

        <Button fullWidth variant="outlined" startIcon={<span>📷</span>}>
          Login by scanning QR Code
        </Button>

        <Box textAlign="center" mt={4}>
          <Typography variant="caption" color="textSecondary">
            🔒 100% secure &nbsp;|&nbsp; ISO 27001 Certified
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileOtpDrawer;
