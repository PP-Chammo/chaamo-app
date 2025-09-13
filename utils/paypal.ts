import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

interface OpenPaypalPaymentParams {
  url: string;
  redirectUrl: string;
  onSuccess?: () => void;
  onCancel?: (redirect?: boolean) => void;
}

/**
 * Robust handler untuk PayPal via openAuthSessionAsync.
 * - Mendaftar Linking listener sebelum membuka browser (recommended by docs).
 * - Jika redirect ditangkap via Linking, treat itu sebagai hasil (parse status).
 * - Jika tidak ada redirect, tangani result.type (success|cancel|dismiss).
 */
export const handlePaypalPayment = async ({
  url,
  redirectUrl,
  onSuccess,
  onCancel,
}: OpenPaypalPaymentParams) => {
  let linkingSubscription: { remove: () => void } | null = null;
  let capturedRedirectUrl: string | null = null;

  const handleDeepLink = (event: { url: string }) => {
    // capture redirect URL (Linking event), then dismiss browser per docs
    capturedRedirectUrl = event.url;
    // dismiss the WebBrowser UI (docs recommend calling dismissBrowser when deep link handled)
    try {
      // dismissBrowser returns a promise; we don't await here to avoid deadlocks
      WebBrowser.dismissBrowser();
    } catch (e) {
      // ignore if dismiss not available on platform
      console.warn('dismissBrowser failed', e);
    }
  };

  try {
    // register listener BEFORE opening browser (important)
    // note: React Native Linking.addEventListener returns subscription
    linkingSubscription = Linking.addEventListener?.('url', handleDeepLink);

    // open auth session
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    console.log('handlePaypalPayment result', result);

    // If we already captured redirect via Linking listener, parse that first (preferred)
    if (capturedRedirectUrl) {
      console.log('Captured redirect via Linking:', capturedRedirectUrl);
      const { queryParams } = Linking.parse(capturedRedirectUrl);
      const status = String(queryParams?.status ?? '');

      if (status === 'success') {
        onSuccess?.();
        return;
      }

      if (['cancel', 'sold'].includes(status)) {
        onCancel?.();
        if (status === 'cancel') {
          Alert.alert('Payment cancelled', 'You cancelled payment.');
        } else if (status === 'sold') {
          Alert.alert('Card sold', 'Card already sold');
          onCancel?.(true);
        }
        return;
      }

      onCancel?.();
      Alert.alert('Payment error', 'Payment failed. Please try again.');
      return;
    }

    // If we didn't capture redirect, fall back to result from openAuthSessionAsync
    if (result.type === 'success' && result.url) {
      const { queryParams } = Linking.parse(result.url);
      const status = String(queryParams?.status ?? '');

      console.log('paypal status from result.url:', status);

      if (status === 'success') {
        onSuccess?.();
        return;
      }

      if (status === 'cancel') {
        onCancel?.();
        Alert.alert('Payment cancelled', 'You cancelled payment.');
        return;
      }

      onCancel?.();
      Alert.alert('Payment error', 'Payment failed. Please try again.');
      return;
    }

    // Non-success paths: treat as cancellation (covers 'dismiss' / 'cancel' / unexpected types)
    // Docs: on mobile, closing equals { type: 'cancel' }; dismissBrowser produces 'dismiss'.
    onCancel?.();
    Alert.alert(
      'Payment cancelled',
      'You closed the browser or cancelled the payment.',
    );
    return;
  } catch (e) {
    console.error('handlePaypalPayment error', e);
    onCancel?.();
    Alert.alert(
      'Payment error',
      'An unexpected error occurred. Please try again.',
    );
    return;
  } finally {
    // cleanup: remove listener
    try {
      if (
        linkingSubscription &&
        typeof linkingSubscription.remove === 'function'
      ) {
        linkingSubscription.remove();
      } else {
        // Backwards-compatible removal for RN versions where addEventListener returns nothing
        // or uses removeEventListener
        // @ts-ignore
        // eslint-disable-next-line import/namespace
        Linking.removeEventListener('url', handleDeepLink);
      }
    } catch (e) {
      console.warn('Failed to remove Linking listener', e);
    }
  }
};
