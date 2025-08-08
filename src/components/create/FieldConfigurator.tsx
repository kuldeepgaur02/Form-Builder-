import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Divider,
  Chip,
  Stack,
  IconButton,
  Alert,
} from '@mui/material';
import { Save, Cancel, Add, Remove, DragIndicator } from '@mui/icons-material';
import { FormField, FieldType, SelectOption } from '../../types/form.types';
import ValidationConfig from './ValidationConfig';
import DerivedFieldConfig from './DerivedFieldConfig';

interface FieldConfiguratorProps {
  field?: FormField;
  allFields: FormField[];
  fieldType: FieldType;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({
  field,
  allFields,
  fieldType,
  onSave,
  onCancel,
}) => {
  const [label, setLabel] = useState(field?.label || '');
  const [required, setRequired] = useState(field?.required || false);
  const [defaultValue, setDefaultValue] = useState(field?.defaultValue || '');
  const [placeholder, setPlaceholder] = useState(field?.placeholder || '');
  const [isDerived, setIsDerived] = useState(field?.isDerived || false);
  const [derivedConfig, setDerivedConfig] = useState(field?.derivedConfig);
  const [validationRules, setValidationRules] = useState(field?.validationRules || []);
  const [options, setOptions] = useState<SelectOption[]>(field?.options || []);
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  
  // Number field specific
  const [min, setMin] = useState<number | undefined>(field?.min);
  const [max, setMax] = useState<number | undefined>(field?.max);
  const [step, setStep] = useState<number | undefined>(field?.step);

  const isEditing = !!field;
  const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldType);
  const isNumberField = fieldType === 'number';
  
  useEffect(() => {
    // Add default options for new fields that need them
    if (!isEditing && needsOptions && options.length === 0) {
      setOptions([
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]);
    }
  }, [fieldType, needsOptions, isEditing, options.length]);

  const handleSave = () => {
    if (!label.trim()) {
      alert('Field label is required');
      return;
    }

    if (needsOptions && options.length === 0) {
      alert('At least one option is required');
      return;
    }

    if (isDerived && (!derivedConfig?.parentFieldIds.length || !derivedConfig?.formula)) {
      alert('Derived fields must have parent fields and a formula');
      return;
    }

    const newField: FormField = {
      id: field?.id || '',
      type: fieldType,
      label: label.trim(),
      required,
      defaultValue,
      placeholder,
      isDerived,
      derivedConfig,
      validationRules,
      order: field?.order || 0,
      ...(needsOptions && { options }),
      ...(isNumberField && { min, max, step }),
    };

    onSave(newField);
  };

  const addOption = () => {
    if (newOption.label && newOption.value) {
      setOptions([...options, { ...newOption }]);
      setNewOption({ label: '', value: '' });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
          {isEditing ? `✏️ Edit ${fieldType} Field` : `➕ Create ${fieldType} Field`}
        </Typography>
        <Chip 
          label={fieldType.toUpperCase()} 
          color="primary" 
          size="small" 
          sx={{ textTransform: 'capitalize' }}
        />
      </Box>

      <Stack spacing={3}>
        {/* Basic Configuration */}
        <Box>
          <Typography variant="h6" gutterBottom>
            📝 Basic Settings
          </Typography>
          
          <TextField
            fullWidth
            label="Field Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Placeholder Text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Text shown when field is empty"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                color="primary"
              />
            }
            label="Required Field"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isDerived}
                onChange={(e) => {
                  setIsDerived(e.target.checked);
                  if (!e.target.checked) {
                    setDerivedConfig(undefined);
                  }
                }}
                color="secondary"
              />
            }
            label="Derived Field (Auto-calculated)"
          />
        </Box>

        {/* Number Field Specific Settings */}
        {isNumberField && (
          <Box>
            <Typography variant="h6" gutterBottom>
              🔢 Number Settings
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Minimum Value"
                type="number"
                value={min || ''}
                onChange={(e) => setMin(e.target.value ? Number(e.target.value) : undefined)}
              />
              <TextField
                label="Maximum Value"
                type="number"
                value={max || ''}
                onChange={(e) => setMax(e.target.value ? Number(e.target.value) : undefined)}
              />
              <TextField
                label="Step"
                type="number"
                value={step || ''}
                onChange={(e) => setStep(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1"
              />
            </Stack>
          </Box>
        )}

        {/* Options Configuration */}
        {needsOptions && (
          <Box>
            <Typography variant="h6" gutterBottom>
              🎯 Options
            </Typography>
            
            {options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <DragIndicator sx={{ color: 'grey.400' }} />
                <TextField
                  label="Label"
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Value"
                  value={option.value}
                  onChange={(e) => updateOption(index, 'value', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton 
                  onClick={() => removeOption(index)} 
                  color="error"
                  disabled={options.length <= 1}
                >
                  <Remove />
                </IconButton>
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField
                label="New Option Label"
                value={newOption.label}
                onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="New Option Value"
                value={newOption.value}
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button 
                startIcon={<Add />} 
                onClick={addOption}
                disabled={!newOption.label || !newOption.value}
                variant="outlined"
              >
                Add
              </Button>
            </Box>
          </Box>
        )}

        {/* Default Value */}
        {!isDerived && (
          <TextField
            fullWidth
            label="Default Value"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            helperText="Value shown by default when form loads"
            type={isNumberField ? 'number' : 'text'}
          />
        )}

        <Divider />

        {/* Derived Field Configuration */}
        {isDerived && (
          <Box>
            <Typography variant="h6" gutterBottom>
              🧮 Derived Field Configuration
            </Typography>
            <DerivedFieldConfig
              currentField={field || { id: '', type: fieldType, label, required, defaultValue, placeholder, isDerived, derivedConfig, validationRules, order: 0 }}
              allFields={allFields}
              derivedConfig={derivedConfig}
              onChange={setDerivedConfig}
            />
          </Box>
        )}

        <Divider />

        {/* Validation Rules */}
        <Box>
          <Typography variant="h6" gutterBottom>
            ✅ Validation Rules
          </Typography>
          <ValidationConfig
            fieldType={fieldType}
            validationRules={validationRules} 
            onChange={setValidationRules}
          />
        </Box>

        <Divider />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            startIcon={<Cancel />}
            onClick={onCancel}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            startIcon={<Save />}
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            {isEditing ? 'Update Field' : 'Create Field'}
          </Button>
        </Stack>

        {/* Help Text */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Tips:</strong>
            <br />
            • Use descriptive labels that clearly indicate what information is needed
            <br />
            • Set appropriate validation rules to ensure data quality
            <br />
            • For derived fields, make sure parent fields are created first
            <br />
            • Test your form after adding fields to ensure everything works as expected
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );
};

export default FieldConfigurator;