import { useEffect } from 'react';

import { currencySymbolMap } from '@/constants/currencies';
import { SupportedCurrency } from '@/types/currency';
import { createReactiveVar } from '@/utils/reactive';

import { useUserVar } from './useUserVar';

type ExchangeRates = Partial<Record<SupportedCurrency, number>>;

const exchangeRatesVar = createReactiveVar<ExchangeRates>({});

const symbolToCurrencyMap: Record<string, SupportedCurrency> = (() => {
  const map: Record<string, SupportedCurrency> = {};
  for (const [code, symbol] of Object.entries(currencySymbolMap)) {
    map[symbol] = code as SupportedCurrency;
  }
  return map;
})();

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

  function formatCurrencyDisplay(
    inputSymbol?: string | null,
    amount?: string | number | null | undefined,
  ): string {
    if (!inputSymbol) return `? ${amount ?? 0}`;

    const fromCurrency = symbolToCurrencyMap[inputSymbol];
    const toCurrency = userCurrency;
    const toSymbol = currencySymbolMap[toCurrency] ?? toCurrency;

    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);

    if (!fromCurrency || isNaN(numericAmount)) {
      return `${inputSymbol} ${amount}`;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];

    if (!fromRate || !toRate) {
      return `${inputSymbol} ${numericAmount.toFixed(2)}`;
    }

    const raw = numericAmount * (toRate / fromRate);
    const convertedAmount = Math.round(raw * 100) / 100;

    const formatted = new Intl.NumberFormat(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);

    return `${toSymbol} ${formatted}`;
  }

  return { formatCurrencyDisplay };
}
