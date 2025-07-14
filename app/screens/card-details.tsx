import { useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { StripeIcon } from '@/assets/svg';
import {
  Button,
  CardField,
  KeyboardView,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';

const initialForm = {
  cardNumber: '',
  expiry: '',
  cvc: '',
};

export default function CardDetailsScreen() {
  const [form, setForm] = useState(initialForm);

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    router.push('/screens/checkout-subscription');
  };

  return (
    <ScreenContainer>
      <Header title="Card Details" onBackPress={router.back} />
      <View className={classes.container}>
        <KeyboardView
          className={classes.keyboardView}
          contentContainerClassName={classes.contentContainer}
        >
          <StripeIcon />
          <CardField
            name="cardNumber"
            label="Card Number"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="2424 2424 2424 2424"
            required
          />
          <Row className={classes.row}>
            <TextField
              name="expiry"
              label="Expiry"
              onChange={handleChange}
              value={form.expiry}
              placeholder="mm/yy"
              keyboardType="numeric"
              maxLength={5}
              required
              className={classes.input}
              type="date"
            />
            <TextField
              name="cvc"
              label="CVC"
              onChange={() => {}}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              required
              className={classes.input}
            />
          </Row>
        </KeyboardView>
      </View>
      <Button className={classes.button} onPress={handleContinue}>
        Continue
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 mx-4.5',
  keyboardView: 'flex-1 mt-8',
  contentContainer: 'gap-6',
  input: 'flex-1',
  row: 'gap-4',
  button: 'mb-10 mx-4.5',
};
