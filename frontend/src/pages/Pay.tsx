import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pay: React.FC = () => {
  const navigate = useNavigate();

  const mobile = localStorage.getItem('new_user_mobile');
  const planId = localStorage.getItem('pendingPlanId');
  const planName = localStorage.getItem('pendingPlanName');
  const amount = parseInt(localStorage.getItem('pendingAmount') || '0');

  useEffect(() => {
    if (!mobile || !planId || !planName || !amount) {
      alert('Missing payment or user info.');
      navigate('/');
      return;
    }

    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => openRazorpay();
      document.body.appendChild(script);
    };

    const openRazorpay = () => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXX',
        amount: amount * 100,
        currency: 'INR',
        name: 'QuickBill',
        description: planName,
        image: '/logo.png',
        handler: async function (response: any) {
          try {
            const res = await axios.post('http://127.0.0.1:8000/api/create-user/', { mobile });

            // Save tokens and payment flag
            localStorage.setItem('access_token', res.data.token.access);
            localStorage.setItem('refresh_token', res.data.token.refresh);
            localStorage.setItem('has_paid', 'true');

            // Cleanup
            localStorage.removeItem('new_user_mobile');
            localStorage.removeItem('pendingPlanId');
            localStorage.removeItem('pendingPlanName');
            localStorage.removeItem('pendingAmount');

            navigate('/dashboard');
          } catch (error) {
            alert('Payment successful, but user creation failed.');
            console.error(error);
          }
        },
        prefill: {
          contact: mobile,
        },
        notes: {
          plan_id: planId,
          plan_name: planName,
        },
        theme: {
          color: '#D82C4E',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    loadRazorpay();
  }, [navigate, mobile, planId, planName, amount]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Redirecting to payment...</h2>
    </div>
  );
};

export default Pay;
