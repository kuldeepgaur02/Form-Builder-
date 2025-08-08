import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormField, FormSchema, FormValues, FieldErrors } from '../../types/form.types';
import { saveFormToStorage, loadFormsFromStorage } from '../../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: loadFormsFromStorage(),
  previewValues: {},
  previewErrors: {},
  isLoading: false,
  error: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    
    removeField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
      // Update order after removal
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const fields = [...state.currentForm.fields];
      const [movedField] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, movedField);
      
      // Update orders
      fields.forEach((field, index) => {
        field.order = index;
      });
      
      state.currentForm.fields = fields;
    },
    
    saveCurrentForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm.fields.length === 0) {
        state.error = 'Cannot save empty form';
        return;
      }
      
      const formSchema: FormSchema = {
        id: uuidv4(),
        name: action.payload,
        fields: state.currentForm.fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.savedForms.push(formSchema);
      saveFormToStorage(formSchema);
      
      // Reset current form
      state.currentForm = {
        name: '',
        fields: [],
      };
      state.error = null;
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: form.fields,
        };
      }
    },
    
    clearCurrentForm: (state) => {
      state.currentForm = {
        name: '',
        fields: [],
      };
      state.previewValues = {};
      state.previewErrors = {};
    },
    
    updatePreviewValue: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.previewValues[fieldId] = value;
    },
    
    setPreviewValues: (state, action: PayloadAction<FormValues>) => {
      state.previewValues = action.payload;
    },
    
    setPreviewErrors: (state, action: PayloadAction<FieldErrors>) => {
      state.previewErrors = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  removeField,
  reorderFields,
  saveCurrentForm,
  loadForm,
  clearCurrentForm,
  updatePreviewValue,
  setPreviewValues,
  setPreviewErrors,
  setError,
} = formSlice.actions;

export default formSlice.reducer;