import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  Stack,
} from '@mui/material';
import {
  Add,
  Preview,
  Edit,
  Delete,
  DateRange,
  Description,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { loadForm, clearCurrentForm } from '../store/slices/formSlice';
import { loadFormsFromStorage, deleteFormFromStorage } from '../utils/localStorage';
import { FormSchema } from '../types/form.types';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.form);

  // Make sure forms are loaded on component mount
  useEffect(() => {
    // Force reload forms from localStorage if needed
    const storedForms = loadFormsFromStorage();
    if (storedForms.length !== savedForms.length) {
      window.location.reload();
    }
  }, [savedForms.length]);

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(loadForm(form.id));
    navigate('/preview');
  };

  // UPDATED: This now properly sets up editing mode
  const handleEditForm = (form: FormSchema) => {
    console.log('Setting up edit mode for form:', form.id);
    dispatch(loadForm(form.id)); // This now also sets editingFormId in Redux
    navigate('/create');
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      deleteFormFromStorage(formId);
      // Reload forms from storage
      window.location.reload(); // Simple reload to refresh the list
    }
  };

  const handleCreateNew = () => {
    dispatch(clearCurrentForm());
    navigate('/create');
  };

  // UPDATED: Enhanced formatDate to handle updated forms
  const formatDate = (dateString: string, isUpdated = false) => {
    const prefix = isUpdated ? 'Updated ' : 'Created ';
    return prefix + new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldTypeStats = (form: FormSchema) => {
    const stats: { [key: string]: number } = {};
    form.fields.forEach(field => {
      stats[field.type] = (stats[field.type] || 0) + 1;
    });
    return stats;
  };

  if (savedForms.length === 0) {
    return (
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            📚 My Forms
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA0D2 90%)',
              }
            }}
          >
            Create New Form
          </Button>
        </Box>

        {/* Empty State */}
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
            📝 No Forms Yet
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#999', mb: 4 }}>
            You haven't created any forms yet. Start building your first form to collect data from users.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA0D2 90%)',
              }
            }}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            📚 My Forms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and preview your saved forms ({savedForms.length} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1BA0D2 90%)',
            }
          }}
        >
          Create New Form
        </Button>
      </Box>

      {/* Forms Container using Flexbox */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
        }}
      >
        {[...savedForms]
          .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
          .map((form) => {
            const fieldStats = getFieldTypeStats(form);
            const derivedFieldsCount = form.fields.filter(f => f.isDerived).length;
            
            return (
              <Box
                key={form.id}
                sx={{
                  flex: {
                    xs: '1 1 100%',      // Full width on mobile
                    sm: '1 1 calc(50% - 12px)',  // Half width on small screens
                    lg: '1 1 calc(33.333% - 16px)', // Third width on large screens
                  },
                  minWidth: '280px',
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    {/* Form Title */}
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {form.name}
                    </Typography>
                    
                    {/* Form Stats */}
                    <Stack spacing={2} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                          {derivedFieldsCount > 0 && (
                            <span> • {derivedFieldsCount} derived</span>
                          )}
                        </Typography>
                      </Box>
                      
                      {/* UPDATED: Enhanced date display */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateRange fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(form.createdAt)}
                          {form.updatedAt && form.updatedAt !== form.createdAt && (
                            <>
                              <br />
                              {formatDate(form.updatedAt, true)}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Field Type Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {Object.entries(fieldStats).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${type} (${count})`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Preview />}
                        onClick={() => handlePreviewForm(form)}
                        variant="contained"
                        color="primary"
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditForm(form)}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                    </Stack>
                    
                    <IconButton
                      onClick={() => handleDeleteForm(form.id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
      </Box>

      {/* Help Section using Flexbox */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
          💡 Quick Tips
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: {
                xs: '1 1 100%',     // Full width on mobile
                md: '1 1 calc(33.333% - 8px)', // Third width on medium+ screens
              },
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Preview Forms
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Preview" to see how your form will appear to users with live validation.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: {
                xs: '1 1 100%',     // Full width on mobile
                md: '1 1 calc(33.333% - 8px)', // Third width on medium+ screens
              },
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Edit Forms
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Edit" to modify existing forms. Changes will update the original form.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: {
                xs: '1 1 100%',     // Full width on mobile
                md: '1 1 calc(33.333% - 8px)', // Third width on medium+ screens
              },
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Form Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Forms are stored locally in your browser. Export important forms before clearing browser data.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MyForms;