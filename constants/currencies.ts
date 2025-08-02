import { SupportedCurrency } from '@/types/currency';

export const currencyMap: Record<SupportedCurrency, string> = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  PKR: 'PKR',
  CAD: 'CAD',
  AUD: 'AUD',
};

export const currencySymbolMap: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: '₨',
  CAD: 'CA$',
  AUD: 'A$',
};
