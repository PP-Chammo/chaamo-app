import { getColor } from '../getColor';

jest.mock('tailwindcss/resolveConfig', () => jest.fn());
// eslint-disable-next-line @typescript-eslint/no-require-imports
const resolveConfig = require('tailwindcss/resolveConfig');

const mockColors = {
  primary: '#123456',
  blue: { 500: '#0000ff', 700: '#000099' },
  red: { 700: '#e11d48' },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getColor', () => {
  it('should return a string color if color is a string', () => {
    resolveConfig.mockReturnValue({ theme: { colors: { ...mockColors } } });
    expect(getColor('primary')).toBe('#123456');
  });

  it('should return a contrast color if color is an object and contrast exists', () => {
    resolveConfig.mockReturnValue({ theme: { colors: { ...mockColors } } });
    expect(getColor('blue-500')).toBe('#0000ff');
  });

  it('should fallback to red[700] if contrast does not exist', () => {
    resolveConfig.mockReturnValue({ theme: { colors: { ...mockColors } } });
    expect(getColor('blue-900')).toBe('#e11d48');
  });

  it('should fallback to #e11d48 if red[700] does not exist', () => {
    resolveConfig.mockReturnValue({
      theme: { colors: { primary: {}, blue: {} } },
    });
    expect(getColor('blue-900')).toBe('#e11d48');
  });

  it('should return #e11d48 if color does not exist', () => {
    resolveConfig.mockReturnValue({ theme: { colors: { ...mockColors } } });
    expect(getColor('unknown')).toBe('#e11d48');
  });
});
