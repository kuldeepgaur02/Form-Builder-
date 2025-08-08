import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
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
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#333' }}>
        ✨ Choose Field Type
      </Typography>
      
      <Grid container spacing={2}>
        {fieldTypes.map((fieldType) => (
          <Grid item xs={12} sm={6} md={4} key={fieldType.type}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: fieldType.color,
                },
                border: '2px solid transparent',
              }}
              onClick={() => onSelectFieldType(fieldType.type)}
            >
              <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: `${fieldType.color}20`,
                    color: fieldType.color,
                    mb: 2,
                  }}
                >
                  {fieldType.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {fieldType.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fieldType.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                <Button
                  size="small"
                  sx={{
                    color: fieldType.color,
                    '&:hover': {
                      backgroundColor: `${fieldType.color}10`,
                    },
                  }}
                >
                  Add Field
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FieldTypeSelector;