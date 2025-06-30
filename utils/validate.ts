export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateRequired<T extends Record<string, any>>(
  values: T,
  requiredFields: (keyof T)[],
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};
  requiredFields.forEach((field) => {
    if (!values[field] || values[field].toString().trim() === '') {
      errors[field] = 'This field is required';
    }
  });
  return errors;
}
