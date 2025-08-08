import { FormField, FormValues } from '../types/form.types';

export const calculateDerivedValue = (
  field: FormField,
  allValues: FormValues,
  allFields: FormField[]
): any => {
  if (!field.isDerived || !field.derivedConfig) {
    return null;
  }
  
  try {
    const { parentFieldIds, formula } = field.derivedConfig;
    
    // Create a context object with parent field values
    const context: { [key: string]: any } = {};
    
    parentFieldIds.forEach(parentId => {
      const parentField = allFields.find(f => f.id === parentId);
      if (parentField) {
        // Use field label as variable name in formula (cleaned up)
        const variableName = parentField.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        context[variableName] = allValues[parentId];
        context[parentId] = allValues[parentId]; // Also allow using field ID
      }
    });
    
    // Add some common utility functions
    context.today = new Date();
    context.calculateAge = (birthDate: string) => {
      if (!birthDate) return 0;
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };
    
    // Create function to evaluate the formula safely
    const evaluateFormula = new Function(...Object.keys(context), `return ${formula}`);
    const result = evaluateFormula(...Object.values(context));
    
    return result;
  } catch (error) {
    console.error('Error calculating derived field value:', error);
    return 'Error in calculation';
  }
};

export const updateDerivedFields = (
  fields: FormField[],
  currentValues: FormValues
): FormValues => {
  const updatedValues = { ...currentValues };
  
  // Find all derived fields
  const derivedFields = fields.filter(field => field.isDerived);
  
  // Calculate values for derived fields
  derivedFields.forEach(field => {
    const derivedValue = calculateDerivedValue(field, updatedValues, fields);
    if (derivedValue !== null) {
      updatedValues[field.id] = derivedValue;
    }
  });
  
  return updatedValues;
};

export const getAvailableParentFields = (
  currentField: FormField,
  allFields: FormField[]
): FormField[] => {
  return allFields.filter(field => 
    field.id !== currentField.id && // Can't be parent of itself
    !field.isDerived && // Derived fields can't be parents
    field.type !== 'checkbox' // Exclude complex types for now
  );
};

export const generateSampleFormulas = (parentFields: FormField[]): string[] => {
  const formulas: string[] = [];
  
  if (parentFields.length === 0) return formulas;
  
  // Age calculation if there's a date field
  const dateField = parentFields.find(f => f.type === 'date');
  if (dateField) {
    const varName = dateField.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    formulas.push(`calculateAge(${varName})`);
  }
  
  // Numeric calculations
  const numericFields = parentFields.filter(f => f.type === 'number');
  if (numericFields.length >= 2) {
    const field1 = numericFields[0].label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const field2 = numericFields[1].label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    formulas.push(`${field1} + ${field2}`);
    formulas.push(`${field1} * ${field2}`);
  }
  
  // String concatenation
  const textFields = parentFields.filter(f => f.type === 'text');
  if (textFields.length >= 2) {
    const field1 = textFields[0].label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const field2 = textFields[1].label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    formulas.push(`${field1} + ' ' + ${field2}`);
  }
  
  return formulas;
};