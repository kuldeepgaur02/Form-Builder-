import React from 'react';
import { Alert, Box } from '@mui/material';

interface ValidationMessageProps {
  errors: string[];
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  
  return (
    <Box sx={{ mt: 1 }}>
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 0.5 }}>
          {error}
        </Alert>
      ))}
    </Box>
  );
};

export default ValidationMessage;