import { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

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

// FIXME: not sure this screen still needed or not, for now keep this

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

  return (
    <ScreenContainer>
      <Header title="Card Details" onBackPress={router.back} />
      <View className={classes.container}>
        <PaymentForm form={form} errors={errors} onChange={handleChange} />
      </View>
      <Button className={classes.button} onPress={() => {}}>
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
