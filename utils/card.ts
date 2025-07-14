import { number } from 'card-validator';

export const formatCardField = (value: string) => {
  return value
    .replace(/\s?/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

export const validateCardNumber = (cardNumber: string) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const validation = number(cleanNumber);

  return {
    isValid: validation.isValid,
    cardType: validation.card?.type || null,
    isVisa: validation.card?.type === 'visa',
    isMasterCard: validation.card?.type === 'mastercard',
  };
};

export const getCardType = (cardNumber: string) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const validation = number(cleanNumber);
  return validation.card?.type || null;
};

export const formatExpiryCardField = (value: string) => {
  const digits = value.replace(/\D/g, '');

  return digits.replace(/^(\d{2})(\d{0,2})$/, (_, month, year) =>
    year ? `${month}/${year}` : month,
  );
};
