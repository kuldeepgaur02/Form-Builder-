export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: number | string | boolean;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DerivedFieldConfig {
  parentFieldIds: string[];
  formula: string; // JavaScript expression
  description?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
  isDerived: boolean;
  derivedConfig?: DerivedFieldConfig;
  order: number;
  // Type-specific properties
  options?: SelectOption[]; // For select, radio
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FieldErrors {
  [fieldId: string]: string[];
}

export interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  previewValues: FormValues;
  previewErrors: FieldErrors;
  isLoading: boolean;
  error: string | null;
}