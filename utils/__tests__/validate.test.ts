import { validateRequired } from '../validate';

describe('validateRequired', () => {
  it('should return errors for missing required fields', () => {
    const values = { name: '', age: 0 };
    const required: (keyof typeof values)[] = ['name', 'age'];
    const errors = validateRequired(values, required);
    expect(errors.name).toBe('This field is required');
    expect(errors.age).toBe('This field is required');
  });

  it('should return errors for whitespace-only strings', () => {
    const values = { name: '   ', age: 25 };
    const required: (keyof typeof values)[] = ['name', 'age'];
    const errors = validateRequired(values, required);
    expect(errors.name).toBe('This field is required');
    expect(errors.age).toBeUndefined();
  });

  it('should return no errors for valid values', () => {
    const values = { name: 'John', age: 30 };
    const required: (keyof typeof values)[] = ['name', 'age'];
    const errors = validateRequired(values, required);
    expect(errors).toEqual({});
  });
});
