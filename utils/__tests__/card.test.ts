import {
  formatCardField,
  formatExpiryCardField,
  getCardType,
  validateCardNumber,
} from '../card';

describe('Card utilities', () => {
  describe('formatCardField', () => {
    it('should format card number with spaces', () => {
      expect(formatCardField('1234567890123456')).toBe('1234 5678 9012 3456');
      expect(formatCardField('1234 5678 9012 3456')).toBe(
        '1234 5678 9012 3456',
      );
    });

    it('should handle empty string', () => {
      expect(formatCardField('')).toBe('');
    });
  });

  describe('formatExpiryCardField', () => {
    it('should format expiry date as MM/YY', () => {
      expect(formatExpiryCardField('1225')).toBe('12/25');
      expect(formatExpiryCardField('0125')).toBe('01/25');
    });

    it('should handle partial input', () => {
      expect(formatExpiryCardField('12')).toBe('12');
      expect(formatExpiryCardField('1')).toBe('1');
    });

    it('should handle empty string', () => {
      expect(formatExpiryCardField('')).toBe('');
    });

    it('should remove non-digit characters', () => {
      expect(formatExpiryCardField('12-25')).toBe('12/25');
      expect(formatExpiryCardField('12 25')).toBe('12/25');
    });
  });

  describe('validateCardNumber', () => {
    it('should validate Visa card numbers', () => {
      const visaNumber = '4532015112830366';
      const result = validateCardNumber(visaNumber);

      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('visa');
      expect(result.isVisa).toBe(true);
      expect(result.isMasterCard).toBe(false);
    });

    it('should validate MasterCard numbers', () => {
      const masterCardNumber = '5425233430109903';
      const result = validateCardNumber(masterCardNumber);

      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('mastercard');
      expect(result.isVisa).toBe(false);
      expect(result.isMasterCard).toBe(true);
    });

    it('should handle invalid card numbers', () => {
      const invalidNumber = '1234567890123456';
      const result = validateCardNumber(invalidNumber);

      expect(result.isValid).toBe(false);
      expect(result.cardType).toBe(null);
      expect(result.isVisa).toBe(false);
      expect(result.isMasterCard).toBe(false);
    });

    it('should handle empty string', () => {
      const result = validateCardNumber('');

      expect(result.isValid).toBe(false);
      expect(result.cardType).toBe(null);
      expect(result.isVisa).toBe(false);
      expect(result.isMasterCard).toBe(false);
    });

    it('should handle formatted card numbers', () => {
      const visaNumber = '4532 0151 1283 0366';
      const result = validateCardNumber(visaNumber);

      expect(result.isValid).toBe(true);
      expect(result.cardType).toBe('visa');
      expect(result.isVisa).toBe(true);
    });
  });

  describe('getCardType', () => {
    it('should return card type for valid numbers', () => {
      expect(getCardType('4532015112830366')).toBe('visa');
      expect(getCardType('5425233430109903')).toBe('mastercard');
    });

    it('should return null for invalid numbers', () => {
      expect(getCardType('1234567890123456')).toBe(null);
      expect(getCardType('')).toBe(null);
    });
  });
});
