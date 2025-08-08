import { FormField, ValidationRule, FormValues } from '../types/form.types';

export const validateField = (field: FormField, value: any): string[] => {
  const errors: string[] = [];
  
  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (rule.value && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
          errors.push(rule.message);
        }
        break;
        
      case 'notEmpty':
        if (value && typeof value === 'string' && value.trim() === '') {
          errors.push(rule.message);
        }
        break;
        
      case 'minLength':
        if (value && typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
        
      case 'maxLength':
        if (value && typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
        
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
        
      case 'password':
        if (value && typeof value === 'string') {
          // Custom password validation: min 8 chars, must contain a number
          if (value.length < 8 || !/\d/.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
    }
  }
  
  return errors;
};

export const validateForm = (fields: FormField[], values: FormValues): { [fieldId: string]: string[] } => {
  const errors: { [fieldId: string]: string[] } = {};
  
  fields.forEach(field => {
    if (!field.isDerived) {
      const fieldErrors = validateField(field, values[field.id]);
      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors;
      }
    }
  });
  
  return errors;
};

export const hasValidationErrors = (errors: { [fieldId: string]: string[] }): boolean => {
  return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
};