import { useEffect } from 'react';

import { currencySymbolMap } from '@/constants/currencies';
import { SupportedCurrency } from '@/types/currency';
import { createReactiveVar } from '@/utils/reactive';

import { useUserVar } from './useUserVar';

type ExchangeRates = Partial<Record<SupportedCurrency, number>>;

const exchangeRatesVar = createReactiveVar<ExchangeRates>({});

export function useCurrencyDisplay() {
  const [user] = useUserVar();
  const userCurrency: SupportedCurrency = user?.profile?.currency ?? 'USD';
  const exchangeRates = exchangeRatesVar.useVar();
  const baseCurrency: SupportedCurrency = 'USD';

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) return;

    async function fetchRates() {
      try {
        const res = await fetch(
          `https://open.er-api.com/v6/latest/${baseCurrency}`,
        );
        const data = await res.json();

        if (data?.result === 'success' && data.rates) {
          exchangeRatesVar.set(data.rates as ExchangeRates);
        } else {
          console.error('Failed to fetch exchange rates', data);
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    }

    fetchRates();
  }, [exchangeRates]);

  function convertCurrencyToSymbol(
    currencyCode?: SupportedCurrency | null,
  ): string {
    if (!currencyCode) {
      return '$';
    }
    return currencySymbolMap[currencyCode] ?? currencyCode;
  }

  function convertSymbolToCurrency(symbol?: string | null): SupportedCurrency {
    if (!symbol) {
      return 'USD';
    }

    const foundCode = Object.entries(currencySymbolMap).find(
      ([_, currencySymbol]) => currencySymbol === symbol,
    )?.[0] as SupportedCurrency;

    return foundCode ?? 'USD';
  }

  function convertBaseToUser(
    baseAmount?: string | number | null | undefined,
    fromCurrency?: SupportedCurrency | null,
  ): number {
    if (!fromCurrency || !baseAmount) {
      return 0;
    }

    const numericAmount =
      typeof baseAmount === 'string'
        ? parseFloat(baseAmount)
        : (baseAmount ?? 0);

    if (isNaN(numericAmount)) {
      return 0;
    }

    if (fromCurrency === userCurrency) {
      return numericAmount;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[userCurrency];

    if (!fromRate || !toRate) {
      return numericAmount;
    }

    const raw = numericAmount * (toRate / fromRate);
    return Math.round(raw * 100) / 100;
  }

  function convertUserToBase(
    userAmount?: string | number | null | undefined,
    toCurrency: SupportedCurrency = 'USD',
  ): number {
    if (!toCurrency || !userAmount) {
      return 0;
    }

    const numericAmount =
      typeof userAmount === 'string'
        ? parseFloat(userAmount)
        : (userAmount ?? 0);

    if (isNaN(numericAmount)) {
      return 0;
    }

    if (toCurrency === userCurrency) {
      return numericAmount;
    }

    const fromRate = exchangeRates[userCurrency];
    const toRate = exchangeRates[toCurrency];

    if (!fromRate || !toRate) {
      console.warn('Exchange rates not available, returning original amount');
      return numericAmount;
    }

    const raw = numericAmount * (toRate / fromRate);
    const result = Math.round(raw * 100) / 100;

    return result;
  }

  function formatDisplay(
    baseCurrency?: string | SupportedCurrency | null,
    amount?: string | number | null | undefined,
    options: {
      unfixed?: boolean;
    } = {
      unfixed: false,
    },
  ): string {
    if (!baseCurrency) return `? ${amount ?? 0}`;

    let currencyCode: SupportedCurrency;
    if (baseCurrency in currencySymbolMap) {
      currencyCode = baseCurrency as SupportedCurrency;
    } else {
      const foundCode = Object.entries(currencySymbolMap).find(
        ([_, symbol]) => symbol === baseCurrency,
      )?.[0] as SupportedCurrency;
      currencyCode = foundCode ?? 'USD';
    }

    const convertedAmount = convertBaseToUser(amount, currencyCode);
    const userSymbol = convertCurrencyToSymbol(userCurrency);

    const formatted = new Intl.NumberFormat(undefined, {
      style: 'decimal',
      minimumFractionDigits: options?.unfixed ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);

    return `${userSymbol}${formatted}`;
  }

  function formatPrice(
    baseCurrency?: string | SupportedCurrency | null,
    amount?: string | number | null | undefined,
    options: {
      unfixed?: boolean;
    } = {
      unfixed: false,
    },
  ): number {
    if (!baseCurrency) return Number(amount ?? 0);

    let currencyCode: SupportedCurrency;
    if (baseCurrency in currencySymbolMap) {
      currencyCode = baseCurrency as SupportedCurrency;
    } else {
      const foundCode = Object.entries(currencySymbolMap).find(
        ([_, symbol]) => symbol === baseCurrency,
      )?.[0] as SupportedCurrency;
      currencyCode = foundCode ?? 'USD';
    }

    // Convert to user's display currency (numeric)
    const convertedAmount = convertBaseToUser(amount, currencyCode);

    // Ensure numeric result (avoid locale string -> Number issues)
    // We already round to 2 decimals in convertBaseToUser; return directly.
    // Keep options.unfixed for API parity with formatDisplay.
    return convertedAmount;
  }

  return {
    convertCurrencyToSymbol,
    convertSymbolToCurrency,
    convertBaseToUser,
    convertUserToBase,
    formatDisplay,
    formatPrice,
  };
}
