export type ValidationValues = Record<string, string | number>;

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateRequired<T extends ValidationValues>(
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

export function areFieldsEmpty<T extends ValidationValues>(obj: T): boolean {
  return Object.values(obj).every((value) => {
    if (typeof value === 'string') return value.trim() === '';

    return !value;
  });
}
