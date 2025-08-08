import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

import {
  TextFields,
  Numbers,
  Subject,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  DateRange,
} from '@mui/icons-material';
import { FieldType } from '../../types/form.types';

interface FieldTypeSelectorProps {
  onSelectFieldType: (type: FieldType) => void;
}

const fieldTypes: Array<{
  type: FieldType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    type: 'text',
    label: 'Text',
    description: 'Single line text input',
    icon: <TextFields />,
    color: '#4CAF50',
  },
  {
    type: 'number',
    label: 'Number',
    description: 'Numeric input with validation',
    icon: <Numbers />,
    color: '#2196F3',
  },
  {
    type: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input',
    icon: <Subject />,
    color: '#FF9800',
  },
  {
    type: 'select',
    label: 'Select',
    description: 'Dropdown selection',
    icon: <ArrowDropDown />,
    color: '#9C27B0',
  },
  {
    type: 'radio',
    label: 'Radio',
    description: 'Single choice from options',
    icon: <RadioButtonChecked />,
    color: '#F44336',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Multiple choice selection',
    icon: <CheckBox />,
    color: '#607D8B',
  },
  {
    type: 'date',
    label: 'Date',
    description: 'Date picker input',
    icon: <DateRange />,
    color: '#795548',
  },
];

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({
  onSelectFieldType,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      >
        ✨ Choose Field Type
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {fieldTypes.map((fieldType) => (
          <Card
            key={fieldType.type}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
              border: `2px solid ${fieldType.color}20`,
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box
                sx={{
                  color: fieldType.color,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {fieldType.icon}
              </Box>
              
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {fieldType.label}
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {fieldType.description}
              </Typography>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                onClick={() => onSelectFieldType(fieldType.type)}
                sx={{
                  backgroundColor: fieldType.color,
                  '&:hover': {
                    backgroundColor: fieldType.color,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                Add Field
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FieldTypeSelector;