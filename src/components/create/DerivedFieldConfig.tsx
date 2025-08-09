import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { ExpandMore, Functions, Lightbulb } from '@mui/icons-material';
import { FormField, DerivedFieldConfig as DerivedConfig } from '../../types/form.types';
import { getAvailableParentFields, generateSampleFormulas } from '../../utils/derivedFields';

interface DerivedFieldConfigProps {
  currentField: FormField;
  allFields: FormField[];
  derivedConfig?: DerivedConfig;
  onChange: (config?: DerivedConfig) => void;
}

const DerivedFieldConfig: React.FC<DerivedFieldConfigProps> = ({
  currentField,
  allFields,
  derivedConfig,
  onChange,
}) => {
  const availableParentFields = getAvailableParentFields(currentField, allFields);
  
  const handleParentFieldChange = (fieldIds: string[]) => {
    const updatedConfig: DerivedConfig = {
      parentFieldIds: fieldIds,
      formula: derivedConfig?.formula || '',
      description: derivedConfig?.description || '',
    };
    onChange(updatedConfig);
  };

  const handleFormulaChange = (formula: string) => {
    const updatedConfig: DerivedConfig = {
      parentFieldIds: derivedConfig?.parentFieldIds || [],
      formula,
      description: derivedConfig?.description || '',
    };
    onChange(updatedConfig);
  };

  const handleDescriptionChange = (description: string) => {
    const updatedConfig: DerivedConfig = {
      parentFieldIds: derivedConfig?.parentFieldIds || [],
      formula: derivedConfig?.formula || '',
      description,
    };
    onChange(updatedConfig);
  };

  const selectedParentFields = availableParentFields.filter(field =>
    derivedConfig?.parentFieldIds.includes(field.id)
  );

  const sampleFormulas = generateSampleFormulas(selectedParentFields);

  if (availableParentFields.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
        <Alert severity="info">
          <Typography variant="body2">
            No parent fields available. Add some regular fields first to create derived fields.
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
        🧮 Derived Field Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Derived fields automatically calculate their values based on other fields in the form.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Parent Fields</InputLabel>
          <Select
            multiple
            value={derivedConfig?.parentFieldIds || []}
            onChange={(e) => handleParentFieldChange(e.target.value as string[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((fieldId) => {
                  const field = availableParentFields.find(f => f.id === fieldId);
                  return (
                    <Chip
                      key={fieldId}
                      label={field?.label || 'Unknown'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableParentFields.map((field) => (
              <MenuItem key={field.id} value={field.id}>
                {field.label} ({field.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Formula"
          value={derivedConfig?.formula || ''}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Enter expression )"
          multiline
          rows={3}
          helperText="Use parent field names (without spaces) as variables in your formula"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description (Optional)"
          value={derivedConfig?.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe what this field calculates"
        />
      </Box>

      {/* Variable Reference */}
      {selectedParentFields.length > 0 && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Functions fontSize="small" />
              Available Variables
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedParentFields.map((field) => {
                const variableName = field.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                return (
                  <Chip
                    key={field.id}
                    label={`${variableName} (${field.label})`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                );
              })}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Available functions: calculateAge(dateString), today (current date)
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Sample Formulas */}
      {sampleFormulas.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb fontSize="small" />
              Sample Formulas
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sampleFormulas.map((formula, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleFormulaChange(formula)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {formula}
                </Button>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default DerivedFieldConfig;