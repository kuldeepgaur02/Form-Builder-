import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { ValidationRule, FieldType } from '../../types/form.types';

interface ValidationConfigProps {
  fieldType: FieldType;
  validationRules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
}

const ValidationConfig: React.FC<ValidationConfigProps> = ({
  fieldType,
  validationRules,
  onChange,
}) => {
  const [newRuleType, setNewRuleType] = useState<ValidationRule['type']>('required');
  const [newRuleValue, setNewRuleValue] = useState<string>('');
  const [newRuleMessage, setNewRuleMessage] = useState<string>('');

  const getAvailableRuleTypes = (): Array<{ value: ValidationRule['type']; label: string }> => {
    const baseRules: Array<{ value: ValidationRule['type']; label: string }> = [
  { value: 'required', label: 'Required' },
  { value: 'notEmpty', label: 'Not Empty' },
];


    if (['text', 'textarea'].includes(fieldType)) {
      baseRules.push(
        { value: 'minLength' as const, label: 'Minimum Length' },
        { value: 'maxLength' as const, label: 'Maximum Length' },
        { value: 'email' as const, label: 'Email Format' },
        { value: 'password' as const, label: 'Password Rules' }
      );
    }

    return baseRules;
  };

  const getDefaultMessage = (type: ValidationRule['type'], value?: any): string => {
    switch (type) {
      case 'required':
        return 'This field is required';
      case 'notEmpty':
        return 'This field cannot be empty';
      case 'minLength':
        return `Minimum ${value || 0} characters required`;
      case 'maxLength':
        return `Maximum ${value || 0} characters allowed`;
      case 'email':
        return 'Please enter a valid email address';
      case 'password':
        return 'Password must be at least 8 characters and contain a number';
      default:
        return 'Invalid input';
    }
  };

  const addValidationRule = () => {
    if (!newRuleMessage.trim()) {
      setNewRuleMessage(getDefaultMessage(newRuleType, newRuleValue));
      return;
    }

    const newRule: ValidationRule = {
      type: newRuleType,
      value: ['minLength', 'maxLength'].includes(newRuleType) 
        ? parseInt(newRuleValue) || 0 
        : newRuleType === 'required' 
        ? true 
        : newRuleValue,
      message: newRuleMessage,
    };

    onChange([...validationRules, newRule]);
    setNewRuleValue('');
    setNewRuleMessage('');
  };

  const removeValidationRule = (index: number) => {
    const updatedRules = validationRules.filter((_, i) => i !== index);
    onChange(updatedRules);
  };

  const needsValue = ['minLength', 'maxLength'].includes(newRuleType);

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
        🛡️ Validation Rules
      </Typography>

      {/* Existing rules */}
      {validationRules.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Rules:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {validationRules.map((rule, index) => (
              <Chip
                key={index}
                label={`${rule.type}${rule.value !== undefined && rule.value !== true ? `: ${rule.value}` : ''}`}
                onDelete={() => removeValidationRule(index)}
                deleteIcon={<Delete />}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Add new rule */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rule Type</InputLabel>
          <Select
            value={newRuleType}
            label="Rule Type"
            onChange={(e) => {
              setNewRuleType(e.target.value as ValidationRule['type']);
              setNewRuleMessage(getDefaultMessage(e.target.value as ValidationRule['type'], newRuleValue));
            }}
          >
            {getAvailableRuleTypes().map((rule) => (
              <MenuItem key={rule.value} value={rule.value}>
                {rule.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {needsValue && (
          <TextField
            size="small"
            label="Value"
            type="number"
            value={newRuleValue}
            onChange={(e) => {
              setNewRuleValue(e.target.value);
              setNewRuleMessage(getDefaultMessage(newRuleType, e.target.value));
            }}
            sx={{ width: 100 }}
          />
        )}

        <TextField
          size="small"
          label="Error Message"
          value={newRuleMessage}
          onChange={(e) => setNewRuleMessage(e.target.value)}
          placeholder={getDefaultMessage(newRuleType, newRuleValue)}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addValidationRule}
          disabled={needsValue && !newRuleValue}
          size="small"
        >
          Add Rule
        </Button>
      </Box>
    </Paper>
  );
};

export default ValidationConfig;