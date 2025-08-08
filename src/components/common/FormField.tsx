import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  FormGroup,
  Box,
  Typography,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { FormField as FormFieldType } from '../../types/form.types';
import ValidationMessage from './ValidationMessage';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  errors?: string[];
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  errors = [],
  disabled = false
}) => {
  const hasError = errors.length > 0;
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={hasError}
            disabled={disabled}
            variant="outlined"
            sx={{ mb: 1 }}
          />
        );
        
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
            error={hasError}
            disabled={disabled}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step
            }}
            variant="outlined"
            sx={{ mb: 1 }}
          />
        );
        
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={hasError}
            disabled={disabled}
            variant="outlined"
            sx={{ mb: 1 }}
          />
        );
        
      case 'select':
        return (
          <FormControl fullWidth error={hasError} disabled={disabled} sx={{ mb: 1 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'radio':
        return (
          <FormControl error={hasError} disabled={disabled} sx={{ mb: 1 }}>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormControl error={hasError} disabled={disabled} sx={{ mb: 1 }}>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <FormGroup>
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={Array.isArray(value) && value.includes(option.value)}
                      onChange={(e) => {
                        const currentValue = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          onChange([...currentValue, option.value]);
                        } else {
                          onChange(currentValue.filter(v => v !== option.value));
                        }
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
        
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange(newValue?.format('YYYY-MM-DD'))}
              disabled={disabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: field.required,
                  error: hasError,
                  sx: { mb: 1 }
                }
              }}
            />
          </LocalizationProvider>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Box>
      {field.isDerived && (
        <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
          🧮 Derived Field
        </Typography>
      )}
      {renderField()}
      <ValidationMessage errors={errors} />
    </Box>
  );
};

export default FormField;