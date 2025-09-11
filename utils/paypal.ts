import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

/**
 * PayPal payment status types
 */
export type PayPalStatus = 'success' | 'cancel' | 'error';

/**
 * PayPal payment types
 */
export enum PayPalPaymentType {
  SUBSCRIPTION = 'subscription',
  CARD_PURCHASE = 'card_purchase',
  ONE_TIME = 'one_time',
}

/**
 * PayPal checkout parameters
 */
export interface PayPalCheckoutParams {
  amount: string;
  currency: string;
  paymentType: PayPalPaymentType;
  planId?: string;
  cardId?: string;
  userId?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Card purchase specific parameters
 */
export interface CardPurchaseParams {
  cardId: string;
  cardTitle: string;
  cardPrice: string;
  cardCurrency: string;
  sellerId?: string;
  categoryId?: string;
}

/**
 * Subscription plan specific parameters
 */
export interface SubscriptionPlanParams {
  paypalPlanId: string;
  membershipPlanId: string;
  subscriberName?: string;
  subscriberEmail: string;
  userId: string;
}

/**
 * PayPal checkout result
 */
export interface PayPalCheckoutResult {
  status: PayPalStatus;
  transactionId?: string;
  error?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * PayPal configuration
 */
interface PayPalConfig {
  baseUrl: string;
  redirectScheme: string;
}

/**
 * Get PayPal configuration from environment
 */
const getPayPalConfig = (isSubscription: boolean = false): PayPalConfig => {
  const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_BACKEND_URL is required for PayPal integration',
    );
  }

  const endpoint = isSubscription
    ? '/paypal/subscription/checkout'
    : '/paypal/checkout';
  return {
    baseUrl: `${baseUrl}${endpoint}`,
    redirectScheme: 'paypal-return',
  };
};

/**
 * Build PayPal checkout URL with parameters
 */
const buildCheckoutUrl = (
  config: PayPalConfig,
  params: PayPalCheckoutParams,
  redirectUrl: string,
): string => {
  const urlParams = new URLSearchParams({
    amount: params.amount,
    currency: params.currency,
    payment_type: params.paymentType,
    redirect: redirectUrl,
    ...(params.planId && { plan_id: params.planId }),
    ...(params.cardId && { card_id: params.cardId }),
    ...(params.userId && { user_id: params.userId }),
    ...(params.metadata && { metadata: JSON.stringify(params.metadata) }),
  });

  return `${config.baseUrl}?${urlParams.toString()}`;
};

/**
 * Build subscription checkout URL with backend-specific parameters
 */
const buildSubscriptionCheckoutUrl = (
  config: PayPalConfig,
  params: SubscriptionPlanParams,
  redirectUrl: string,
): string => {
  const urlParams = new URLSearchParams({
    paypal_plan_id: params.paypalPlanId,
    membership_plan_id: params.membershipPlanId,
    user_id: params.userId,
    subscriber_email: params.subscriberEmail,
    redirect: redirectUrl,
    ...(params.subscriberName && { subscriber_name: params.subscriberName }),
  });

  return `${config.baseUrl}?${urlParams.toString()}`;
};

/**
 * Parse PayPal callback URL and extract result
 */
const parsePayPalResult = (url: string): PayPalCheckoutResult => {
  const { queryParams } = Linking.parse(url);
  const status = String(queryParams?.status ?? 'error') as PayPalStatus;

  return {
    status,
    transactionId: queryParams?.transaction_id as string,
    error: queryParams?.error as string,
    metadata: queryParams?.metadata
      ? JSON.parse(queryParams.metadata as string)
      : undefined,
  };
};

/**
 * Handle PayPal checkout success
 */
const handlePayPalSuccess = (
  result: PayPalCheckoutResult,
  onSuccess?: (result: PayPalCheckoutResult) => void,
): void => {
  if (onSuccess) {
    onSuccess(result);
  } else {
    Alert.alert(
      'Payment Successful',
      'Your PayPal payment has been processed successfully.',
    );
  }
};

/**
 * Handle PayPal checkout cancellation
 */
const handlePayPalCancel = (onCancel?: () => void): void => {
  if (onCancel) {
    onCancel();
  } else {
    Alert.alert('Payment Cancelled', 'You cancelled the PayPal checkout.');
  }
};

/**
 * Handle PayPal checkout error
 */
const handlePayPalError = (
  error: string | undefined,
  onError?: (error: string) => void,
): void => {
  const errorMessage = error || 'PayPal checkout failed. Please try again.';

  if (onError) {
    onError(errorMessage);
  } else {
    Alert.alert('Payment Error', errorMessage);
  }
};

/**
 * PayPal checkout callback handlers
 */
export interface PayPalHandlers {
  onSuccess?: (result: PayPalCheckoutResult) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

/**
 * Main PayPal checkout function
 * Handles the complete PayPal checkout flow with WebBrowser
 */
export const initiatePayPalCheckout = async (
  params: PayPalCheckoutParams,
  handlers?: PayPalHandlers,
): Promise<PayPalCheckoutResult> => {
  try {
    const config = getPayPalConfig();
    const redirectUrl = Linking.createURL(config.redirectScheme);
    const checkoutUrl = buildCheckoutUrl(config, params, redirectUrl);

    const result = await WebBrowser.openAuthSessionAsync(
      checkoutUrl,
      redirectUrl,
    );

    console.log({ result });

    // Handle WebBrowser result
    if (result.type === 'success' && result.url) {
      const paypalResult = parsePayPalResult(result.url);

      switch (paypalResult.status) {
        case 'success':
          handlePayPalSuccess(paypalResult, handlers?.onSuccess);
          return paypalResult;

        case 'cancel':
          handlePayPalCancel(handlers?.onCancel);
          return paypalResult;

        default:
          handlePayPalError(paypalResult.error, handlers?.onError);
          return paypalResult;
      }
    }

    // Handle WebBrowser cancellation
    if (result.type === 'cancel') {
      const cancelResult: PayPalCheckoutResult = { status: 'cancel' };
      handlePayPalCancel(handlers?.onCancel);
      return cancelResult;
    }

    // Handle WebBrowser error
    const errorResult: PayPalCheckoutResult = {
      status: 'error',
      error: 'Unable to complete PayPal checkout',
    };
    handlePayPalError(errorResult.error, handlers?.onError);
    return errorResult;
  } catch (error) {
    console.error('PayPal checkout error:', error);
    const errorMessage = 'Unable to start PayPal checkout';
    const errorResult: PayPalCheckoutResult = {
      status: 'error',
      error: errorMessage,
    };
    handlePayPalError(errorMessage, handlers?.onError);
    return errorResult;
  }
};

/**
 * PayPal subscription checkout using backend endpoint
 */
export const payPalSubscriptionCheckout = async (
  subscriptionParams: SubscriptionPlanParams,
  handlers?: PayPalHandlers,
): Promise<PayPalCheckoutResult> => {
  try {
    const config = getPayPalConfig(true); // true for subscription endpoint
    const redirectUrl = Linking.createURL(config.redirectScheme);
    const checkoutUrl = buildSubscriptionCheckoutUrl(
      config,
      subscriptionParams,
      redirectUrl,
    );

    const result = await WebBrowser.openAuthSessionAsync(
      checkoutUrl,
      redirectUrl,
    );

    console.log({ result });

    // Handle WebBrowser result
    if (result.type === 'success' && result.url) {
      const paypalResult = parsePayPalResult(result.url);

      switch (paypalResult.status) {
        case 'success':
          handlePayPalSuccess(paypalResult, handlers?.onSuccess);
          return paypalResult;

        case 'cancel':
          handlePayPalCancel(handlers?.onCancel);
          return paypalResult;

        default:
          handlePayPalError(paypalResult.error, handlers?.onError);
          return paypalResult;
      }
    }

    // Handle WebBrowser cancellation
    if (result.type === 'cancel') {
      const cancelResult: PayPalCheckoutResult = { status: 'cancel' };
      handlePayPalCancel(handlers?.onCancel);
      return cancelResult;
    }

    // Handle WebBrowser error
    const errorResult: PayPalCheckoutResult = {
      status: 'error',
      error: 'Unable to complete PayPal subscription checkout',
    };
    handlePayPalError(errorResult.error, handlers?.onError);
    return errorResult;
  } catch (error) {
    console.error('PayPal subscription checkout error:', error);
    const errorMessage = 'Unable to start PayPal subscription checkout';
    const errorResult: PayPalCheckoutResult = {
      status: 'error',
      error: errorMessage,
    };
    handlePayPalError(errorMessage, handlers?.onError);
    return errorResult;
  }
};

/**
 * PayPal checkout for card purchases
 */
export const payPalCardPurchase = async (
  cardParams: CardPurchaseParams,
  userId: string,
  handlers?: PayPalHandlers,
): Promise<PayPalCheckoutResult> => {
  return initiatePayPalCheckout(
    {
      amount: cardParams.cardPrice,
      currency: cardParams.cardCurrency,
      paymentType: PayPalPaymentType.CARD_PURCHASE,
      cardId: cardParams.cardId,
      userId,
      metadata: {
        type: PayPalPaymentType.CARD_PURCHASE,
        cardTitle: cardParams.cardTitle,
        ...(cardParams.sellerId && { sellerId: cardParams.sellerId }),
        ...(cardParams.categoryId && { categoryId: cardParams.categoryId }),
      },
    },
    handlers,
  );
};

/**
 * PayPal checkout for one-time payments
 */
export const payPalOneTimeCheckout = async (
  amount: string,
  currency: string = 'USD',
  userId?: string,
  metadata?: Record<string, string>,
  handlers?: PayPalHandlers,
): Promise<PayPalCheckoutResult> => {
  return initiatePayPalCheckout(
    {
      amount,
      currency,
      paymentType: PayPalPaymentType.ONE_TIME,
      userId,
      metadata: { type: PayPalPaymentType.ONE_TIME, ...metadata },
    },
    handlers,
  );
};

/**
 * Validate PayPal checkout parameters
 */
export const validatePayPalParams = (params: PayPalCheckoutParams): boolean => {
  if (!params.amount || parseFloat(params.amount) <= 0) {
    return false;
  }

  if (!params.currency || params.currency.length !== 3) {
    return false;
  }

  if (
    !params.paymentType ||
    !Object.values(PayPalPaymentType).includes(params.paymentType)
  ) {
    return false;
  }

  // Validate specific payment type requirements
  if (params.paymentType === PayPalPaymentType.SUBSCRIPTION && !params.planId) {
    return false;
  }

  if (
    params.paymentType === PayPalPaymentType.CARD_PURCHASE &&
    !params.cardId
  ) {
    return false;
  }

  return true;
};

/**
 * Validate card purchase parameters
 */
export const validateCardPurchaseParams = (
  params: CardPurchaseParams,
): boolean => {
  if (!params.cardId || !params.cardTitle) {
    return false;
  }

  if (!params.cardPrice || parseFloat(params.cardPrice) <= 0) {
    return false;
  }

  if (!params.cardCurrency || params.cardCurrency.length !== 3) {
    return false;
  }

  return true;
};

/**
 * Validate subscription plan parameters
 */
export const validateSubscriptionParams = (
  params: SubscriptionPlanParams,
): boolean => {
  if (!params.paypalPlanId || !params.membershipPlanId) {
    return false;
  }

  if (!params.userId) {
    return false;
  }

  if (!params.subscriberEmail || !params.subscriberEmail.includes('@')) {
    return false;
  }

  return true;
};

/**
 * Get supported PayPal currencies
 */
export const getSupportedCurrencies = (): string[] => {
  return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
};

/**
 * Check if currency is supported by PayPal
 */
export const isCurrencySupported = (currency: string): boolean => {
  return getSupportedCurrencies().includes(currency.toUpperCase());
};
