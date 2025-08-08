import { FormSchema } from '../types/form.types';

const STORAGE_KEY = 'upliance-form-builder';

export const saveFormToStorage = (form: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const updatedForms = [...existingForms, form];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error saving form to localStorage:', error);
  }
};

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const storedForms = localStorage.getItem(STORAGE_KEY);
    return storedForms ? JSON.parse(storedForms) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const deleteFormFromStorage = (formId: string): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const updatedForms = existingForms.filter(form => form.id !== formId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error deleting form from localStorage:', error);
  }
};

export const updateFormInStorage = (updatedForm: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const updatedForms = existingForms.map(form => 
      form.id === updatedForm.id ? updatedForm : form
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error updating form in localStorage:', error);
  }
};