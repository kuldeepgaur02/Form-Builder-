import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { ArrowBack, Send, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  updatePreviewValue,
  setPreviewValues,
  setPreviewErrors,
} from '../store/slices/formSlice';
import { FormField as FormFieldType, FormValues } from '../types/form.types';
import FormField from '../components/common/FormField';
import { validateForm, hasValidationErrors } from '../utils/validation';
import { updateDerivedFields } from '../utils/derivedFields';

const PreviewForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, previewValues, previewErrors } = useSelector(
    (state: RootState) => state.form
  );

  useEffect(() => {
    // Initialize preview values with default values
    const initialValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (!field.isDerived && field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    
    // Calculate derived fields
    const updatedValues = updateDerivedFields(currentForm.fields, initialValues);
    dispatch(setPreviewValues(updatedValues));
  }, [currentForm.fields, dispatch]);

  useEffect(() => {
    // Recalculate derived fields whenever values change
    const updatedValues = updateDerivedFields(currentForm.fields, previewValues);
    if (JSON.stringify(updatedValues) !== JSON.stringify(previewValues)) {
      dispatch(setPreviewValues(updatedValues));
    }
  }, [previewValues, currentForm.fields, dispatch]);

  useEffect(() => {
    // Validate form whenever values change
    const errors = validateForm(currentForm.fields, previewValues);
    dispatch(setPreviewErrors(errors));
  }, [previewValues, currentForm.fields, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updatePreviewValue({ fieldId, value }));
  };

  const handleSubmit = () => {
    const errors = validateForm(currentForm.fields, previewValues);
    dispatch(setPreviewErrors(errors));

    if (!hasValidationErrors(errors)) {
      alert('Form submitted successfully! 🎉\n\nForm Data:\n' + JSON.stringify(previewValues, null, 2));
    } else {
      alert('Please fix the validation errors before submitting.');
    }
  };

  const handleReset = () => {
    const initialValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (!field.isDerived && field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    
    const updatedValues = updateDerivedFields(currentForm.fields, initialValues);
    dispatch(setPreviewValues(updatedValues));
    dispatch(setPreviewErrors({}));
  };

  if (currentForm.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom color="text.secondary">
          📝 No Form to Preview
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Create a form first before previewing it.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/create')}
        >
          Go to Form Builder
        </Button>
      </Box>
    );
  }

  // Create a copy of the array before sorting to avoid mutating Redux state
  const sortedFields = [...currentForm.fields].sort((a, b) => a.order - b.order);
  const hasErrors = hasValidationErrors(previewErrors);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
          👁️ Form Preview
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/create')}
          >
            Back to Builder
          </Button>
          
        </Stack>
      </Box>

      {/* Form Preview */}
      <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
          {currentForm.name || 'Untitled Form'}
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          This is how your form will appear to users. All validations and derived fields are active.
        </Alert>

        <Stack spacing={3}>
          {sortedFields.map((field) => (
            <Box key={field.id}>
              <FormField
                field={field}
                value={previewValues[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                errors={previewErrors[field.id] || []}
                disabled={field.isDerived}
              />
              
              {field.isDerived && field.derivedConfig?.description && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
                >
                  💡 {field.derivedConfig.description}
                </Typography>
              )}
            </Box>
          ))}
          
          <Divider sx={{ my: 4 }} />
          
          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>


          </Box>
          
          {hasErrors && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please fix the validation errors above before submitting the form.
            </Alert>
          )}
        </Stack>
      </Paper>


    </Box>
  );
};

export default PreviewForm;