import React, { useState, useEffect } from 'react';
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
  Update,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import {
  addField,
  updateField,
  removeField,
  reorderFields,
  saveCurrentForm,
  updateExistingForm, // You'll need to add this action
  clearCurrentForm,
  setFormName,
} from '../store/slices/formSlice';
import { FieldType, FormField } from '../types/form.types';
import FieldTypeSelector from '../components/create/FieldTypeSelector';
import FieldConfigurator from '../components/create/FieldConfigurator';

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, error, editingFormId } = useSelector((state: RootState) => state.form);
  
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormNameLocal] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [fieldBeingEdited, setFieldBeingEdited] = useState<string | null>(null);
  
  // Check if we're editing an existing form
  const isEditingExistingForm = !!editingFormId;

  // Set form name when editing existing form
  useEffect(() => {
    if (isEditingExistingForm && currentForm.name) {
      setFormNameLocal(currentForm.name);
    } else if (!isEditingExistingForm) {
      setFormNameLocal(''); // Clear form name when creating new form
    }
  }, [isEditingExistingForm, currentForm.name]);

  // Reset editing states when not needed
  useEffect(() => {
    if (!selectedFieldType && !showFieldSelector) {
      setEditingField(null);
      setIsEditMode(false);
      setFieldBeingEdited(null);
    }
  }, [selectedFieldType, showFieldSelector]);

  const handleSelectFieldType = (type: FieldType) => {
    setSelectedFieldType(type);
    setShowFieldSelector(false);
    if (!fieldBeingEdited) {
      setIsEditMode(false);
    }
  };

  const handleSaveField = (field: FormField) => {
    try {
      if (isEditMode && editingField && fieldBeingEdited) {
        console.log('Updating field:', { original: editingField, updated: field });
        
        const updatedField = { 
          ...field, 
          id: editingField.id,
          order: editingField.order
        };
        
        dispatch(updateField(updatedField));
        console.log('Field update dispatched:', updatedField);
        
      } else {
        console.log('Adding new field:', field);
        dispatch(addField(field));
      }

      resetEditingState();
      
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Error saving field. Please try again.');
    }
  };

  const resetEditingState = () => {
    setSelectedFieldType(null);
    setEditingField(null);
    setIsEditMode(false);
    setFieldBeingEdited(null);
  };

  const handleCancelFieldConfig = () => {
    resetEditingState();
  };

  const handleEditField = (field: FormField) => {
    console.log('Starting edit for field:', field);
    
    setEditingField({ ...field });
    setSelectedFieldType(field.type);
    setIsEditMode(true);
    setFieldBeingEdited(field.id);
    
    console.log('Edit state set:', { 
      fieldId: field.id, 
      fieldType: field.type, 
      isEditMode: true 
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      if (fieldBeingEdited === fieldId) {
        resetEditingState();
      }
      dispatch(removeField(fieldId));
    }
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
      if (isEditingExistingForm && editingFormId) {
        // Update existing form
        console.log('Updating existing form with ID:', editingFormId);
        console.log('Form data:', { name: formName.trim(), fields: currentForm.fields });
        dispatch(updateExistingForm({ 
          id: editingFormId, 
          name: formName.trim(),
          fields: currentForm.fields 
        }));
        alert('Form updated successfully!');
        
        // Navigate back to My Forms after a short delay
        setTimeout(() => {
          navigate('/create');
        }, 1000);
      } else {
        // Create new form
        console.log('Creating new form');
        dispatch(saveCurrentForm(formName.trim()));
        alert('Form saved successfully!');
        
        // Stay on the create form page for new forms or navigate as needed
      }
      
      setShowSaveDialog(false);
      setFormNameLocal('');
    }
  };

  const handleClearForm = () => {
    const message = isEditingExistingForm 
      ? 'Are you sure you want to clear the form? All unsaved changes will be lost.' 
      : 'Are you sure you want to clear the form? All unsaved changes will be lost.';
      
    if (window.confirm(message)) {
      resetEditingState();
      dispatch(clearCurrentForm());
    }
  };

  const handleCancelEdit = () => {
    if (isEditingExistingForm) {
      if (window.confirm('Are you sure you want to cancel editing? All unsaved changes will be lost.')) {
        dispatch(clearCurrentForm());
        navigate('/create');
      }
    }
  };

  // Show field configurator if editing or adding a new field
  if (selectedFieldType) {
    return (
      <FieldConfigurator
        field={isEditMode && editingField ? editingField : undefined}
        allFields={currentForm.fields}
        fieldType={selectedFieldType}
        onSave={handleSaveField}
        onCancel={handleCancelFieldConfig}
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            🏗️ {isEditingExistingForm ? 'Edit Form' : 'Form Builder'}
          </Typography>
          {isEditingExistingForm && (
            <Typography variant="body1" color="text.secondary">
              Editing: {currentForm.name || 'Untitled Form'}
            </Typography>
          )}
        </Box>
        
        <Stack direction="row" spacing={2}>
          {isEditingExistingForm && (
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              color="secondary"
            >
              Cancel Edit
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearForm}
            disabled={currentForm.fields.length === 0}
          >
            Clear Form
          </Button>
         
          <Button
            variant="contained"
            startIcon={isEditingExistingForm ? <Update /> : <Save />}
            onClick={handleSaveForm}
            disabled={currentForm.fields.length === 0}
            sx={{
              background: isEditingExistingForm 
                ? 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)'
                : 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
              '&:hover': {
                background: isEditingExistingForm
                  ? 'linear-gradient(45deg, #F57C00 30%, #FF9800 90%)'
                  : 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
              }
            }}
          >
            {isEditingExistingForm ? 'Update Form' : 'Save Form'}
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Status Alert */}
      {isEditingExistingForm && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are editing an existing form. Changes will update the original form when you click "Update Form".
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
                    border: fieldBeingEdited === field.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    backgroundColor: fieldBeingEdited === field.id ? '#f3f8ff' : 'white',
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
                          {fieldBeingEdited === field.id && (
                            <Chip label="Editing" size="small" color="info" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {field.placeholder || 'No placeholder'}
                          {field.isDerived && field.derivedConfig?.description && 
                            ` • ${field.derivedConfig.description}`
                          }
                        </Typography>
                        
                        {field.validationRules && field.validationRules.length > 0 && (
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
                          title="Edit field"
                          disabled={fieldBeingEdited === field.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteField(field.id)}
                          color="error"
                          size="small"
                          title="Delete field"
                          disabled={fieldBeingEdited === field.id}
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
            🎯 {isEditingExistingForm ? 'Add Fields to Your Form' : 'Start Building Your Form'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#999', mb: 4 }}>
            {isEditingExistingForm 
              ? 'Add fields to enhance your existing form.'
              : 'Add your first field to get started. You can choose from text, number, date, and many other field types.'
            }
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
            {isEditingExistingForm ? 'Add Field' : 'Add First Field'}
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
            disabled={!!fieldBeingEdited}
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
        disabled={!!fieldBeingEdited}
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

      {/* Save/Update Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>
          💾 {isEditingExistingForm ? 'Update Form' : 'Save Form'}
        </DialogTitle>
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
          {isEditingExistingForm && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This will update the existing form with your changes.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmSaveForm}
            variant="contained"
            disabled={!formName.trim()}
          >
            {isEditingExistingForm ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateForm;