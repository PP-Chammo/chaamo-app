import { SupportedCurrency } from '@/types/currency';

export const currencyMap: Record<SupportedCurrency, string> = {
  GBP: 'GBP',
  USD: 'USD',
  EUR: 'EUR',
  CAD: 'CAD',
  AUD: 'AUD',
};

export const currencySymbolMap: Record<SupportedCurrency, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  CAD: 'CA$',
  AUD: 'A$',
};

export const currencyCountryMap: Record<SupportedCurrency, string> = {
  GBP: '🇬🇧',
  USD: '🇺🇸',
  CAD: '🇨🇦',
  EUR: '🇪🇺',
  AUD: '🇦🇺',
};
