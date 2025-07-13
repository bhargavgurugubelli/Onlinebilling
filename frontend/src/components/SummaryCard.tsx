// components/SummaryCard.tsx

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

const SummaryCard = ({ title, value, icon, color = '#1976d2' }: SummaryCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        px: 2,
        py: 3,
        height: '100%',
        backgroundColor: '#fff',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                bgcolor: color,
                color: 'white',
                p: 1.2,
                borderRadius: 2,
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
