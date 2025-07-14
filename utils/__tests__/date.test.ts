import { formatTime, formatDate } from '../date';

jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    isToday: jest.fn(),
    isYesterday: jest.fn(),
    isThisWeek: jest.fn(),
    isThisYear: jest.fn(),
    format: jest.fn(() => 'formatted'),
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { isToday, isYesterday, isThisWeek, isThisYear } = require('date-fns');

describe('date utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatTime', () => {
    it('should return formatted time if today', () => {
      isToday.mockReturnValue(true);
      expect(formatTime('2024-06-01T10:00:00Z')).toBe('formatted');
    });
    it('should return Yesterday if yesterday', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(true);
      expect(formatTime('2024-06-01T10:00:00Z')).toBe('Yesterday');
    });
    it('should return formatted day if this week', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(true);
      expect(formatTime('2024-06-01T10:00:00Z')).toBe('formatted');
    });
    it('should return formatted month/day if this year', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(false);
      isThisYear.mockReturnValue(true);
      expect(formatTime('2024-06-01T10:00:00Z')).toBe('formatted');
    });
    it('should return formatted full date if not this year', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(false);
      isThisYear.mockReturnValue(false);
      expect(formatTime('2024-06-01T10:00:00Z')).toBe('formatted');
    });
  });

  describe('formatDate', () => {
    it('should return Today if today', () => {
      isToday.mockReturnValue(true);
      expect(formatDate('2024-06-01T10:00:00Z')).toBe('Today');
    });
    it('should return Yesterday if yesterday', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(true);
      expect(formatDate('2024-06-01T10:00:00Z')).toBe('Yesterday');
    });
    it('should return formatted day if this week', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(true);
      expect(formatDate('2024-06-01T10:00:00Z')).toBe('formatted');
    });
    it('should return formatted month/day if this year', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(false);
      isThisYear.mockReturnValue(true);
      expect(formatDate('2024-06-01T10:00:00Z')).toBe('formatted');
    });
    it('should return formatted full date if not this year', () => {
      isToday.mockReturnValue(false);
      isYesterday.mockReturnValue(false);
      isThisWeek.mockReturnValue(false);
      isThisYear.mockReturnValue(false);
      expect(formatDate('2024-06-01T10:00:00Z')).toBe('formatted');
    });
  });
});
