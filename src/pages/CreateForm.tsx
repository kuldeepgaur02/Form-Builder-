import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DragIndicator,
  Save,
  Clear,
  Preview,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  addField,
  updateField,
  removeField,
  reorderFields,
  saveCurrentForm,
  clearCurrentForm,
  setFormName,
} from '../store/slices/formSlice';
import { FieldType, FormField } from '../types/form.types';
import FieldTypeSelector from '../components/create/FieldTypeSelector';
import FieldConfigurator from '../components/create/FieldConfigurator';

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, error } = useSelector((state: RootState) => state.form);
  
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormNameLocal] = useState('');

  const handleSelectFieldType = (type: FieldType) => {
    setSelectedFieldType(type);
    setShowFieldSelector(false);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch(updateField(field));
      setEditingField(null);
    } else {
      dispatch(addField(field));
    }
    setSelectedFieldType(null);
  };

  const handleCancelFieldConfig = () => {
    setSelectedFieldType(null);
    setEditingField(null);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleSaveForm = () => {
    if (currentForm.fields.length === 0) {
      alert('Please add at least one field before saving');
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSaveForm = () => {
    if (formName.trim()) {
      dispatch(saveCurrentForm(formName));
      setShowSaveDialog(false);
      setFormNameLocal('');
      alert('Form saved successfully!');
    }
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the form? All unsaved changes will be lost.')) {
      dispatch(clearCurrentForm());
    }
  };

  const handlePreview = () => {
    if (currentForm.fields.length === 0) {
      alert('Please add at least one field before previewing');
      return;
    }
    navigate('/preview');
  };

  // Show field configurator if editing or adding a new field
  if (selectedFieldType || editingField) {
    return (
      <FieldConfigurator
        field={editingField || undefined}
        allFields={currentForm.fields}
        fieldType={selectedFieldType || editingField!.type}
        onSave={handleSaveField}
        onCancel={handleCancelFieldConfig}
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
          🏗️ Form Builder
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearForm}
            disabled={currentForm.fields.length === 0}
          >
            Clear Form
          </Button>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={handlePreview}
            disabled={currentForm.fields.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveForm}
            disabled={currentForm.fields.length === 0}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
              }
            }}
          >
            Save Form
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Field List */}
      {currentForm.fields.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
            📋 Form Fields ({currentForm.fields.length})
          </Typography>
          
          <Stack spacing={2}>
            {currentForm.fields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <Card 
                  key={field.id} 
                  variant="outlined"
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      boxShadow: 2,
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DragIndicator sx={{ color: 'grey.400', cursor: 'grab' }} />
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" component="span">
                            {field.label}
                          </Typography>
                          <Chip 
                            label={field.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          {field.required && (
                            <Chip label="Required" size="small" color="error" />
                          )}
                          {field.isDerived && (
                            <Chip label="Derived" size="small" color="secondary" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {field.placeholder || 'No placeholder'}
                          {field.isDerived && field.derivedConfig?.description && 
                            ` • ${field.derivedConfig.description}`
                          }
                        </Typography>
                        
                        {field.validationRules.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Validation rules: {field.validationRules.length}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditField(field)}
                          color="primary"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteField(field.id)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </Paper>
      )}

      {/* Empty State or Add Field Button */}
      {currentForm.fields.length === 0 ? (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: '#fafafa',
            border: '2px dashed #e0e0e0'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#666' }}>
            🎯 Start Building Your Form
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#999', mb: 4 }}>
            Add your first field to get started. You can choose from text, number, date, 
            and many other field types.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowFieldSelector(true)}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA0D2 90%)',
              }
            }}
          >
            Add First Field
          </Button>
        </Paper>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowFieldSelector(true)}
            size="large"
            sx={{ minWidth: 200 }}
          >
            Add Another Field
          </Button>
        </Box>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => setShowFieldSelector(true)}
      >
        <Add />
      </Fab>

      {/* Field Type Selector Dialog */}
      <Dialog
        open={showFieldSelector}
        onClose={() => setShowFieldSelector(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Field Type</DialogTitle>
        <DialogContent>
          <FieldTypeSelector onSelectFieldType={handleSelectFieldType} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFieldSelector(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>💾 Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormNameLocal(e.target.value)}
            placeholder="Enter a name for your form"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmSaveForm}
            variant="contained"
            disabled={!formName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateForm;