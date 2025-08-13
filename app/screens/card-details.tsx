import { useCallback, useState } from 'react';

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { PaymentForm } from '@/components/organisms';
import { TextChangeParams } from '@/domains';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const initialForm = {
  cardNumber: '',
  expiry: '',
  cvc: '',
};

export default function CardDetailsScreen() {
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<Form>>({});

  const handleChange = useCallback(({ name, value }: TextChangeParams) => {
    setErrors((prev) => {
      delete prev[name as keyof typeof prev];
      return prev;
    });
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleContinue = useCallback(() => {
    const errors = validateRequired<Form>(form, [
      'cardNumber',
      'expiry',
      'cvc',
    ]);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    return router.push('/screens/checkout-subscription');
  }, [form]);

  const handlePayWithPaypal = useCallback(async () => {
    const baseUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/paypal/checkout`;
    if (!baseUrl) {
      Alert.alert('Missing configuration', 'PayPal needs checkout endpoint.');
      return;
    }

    // Build an app-specific redirect URL (must be whitelisted by your backend with PayPal)
    const redirectUrl = Linking.createURL('paypal-return');
    const amount = '9.99';
    const currency = 'USD';
    const startUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}amount=${encodeURIComponent(
      amount,
    )}&currency=${encodeURIComponent(currency)}&redirect=${encodeURIComponent(redirectUrl)}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        startUrl,
        redirectUrl,
      );

      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const status = String(queryParams?.status ?? '');

        if (status === 'success') {
          router.push('/screens/checkout-subscription');
          return;
        }

        if (status === 'cancel') {
          Alert.alert(
            'Payment cancelled',
            'You cancelled the PayPal checkout.',
          );
          return;
        }

        Alert.alert(
          'Payment error',
          'PayPal checkout failed. Please try again.',
        );
        return;
      }

      if (result.type === 'cancel') {
        Alert.alert('Payment cancelled', 'You cancelled the PayPal checkout.');
        return;
      }

      Alert.alert('Payment error', 'Unable to complete PayPal checkout.');
    } catch (e) {
      console.error('PayPal checkout error', e);
      Alert.alert('Payment error', 'Unable to start PayPal checkout.');
    }
  }, []);

  return (
    <ScreenContainer>
      <Header title="Card Details" onBackPress={router.back} />
      <View className={classes.container}>
        <PaymentForm form={form} errors={errors} onChange={handleChange} />
      </View>
      <Button className={classes.button} onPress={handlePayWithPaypal}>
        Pay with PayPal
      </Button>
      <Button className={classes.button} onPress={handleContinue}>
        Continue
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 mx-4.5',
  button: 'mb-10 mx-4.5',
};
