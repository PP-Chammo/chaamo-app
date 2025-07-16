import React, { useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, KeyboardView, Row, ScreenContainer } from '@/components/atoms';
import {
  Header,
  SelectModal,
  SetupProfileTabs,
  TextField,
} from '@/components/molecules';
import { COUNTRIES, STATES } from '@/constants/dummy';
import { TextChangeParams } from '@/domains';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
}

export default function AddressScreen() {
  const [form, setForm] = useState<Form>({
    city: '',
    state: '',
    country: '',
    postalCode: '',
    addressLine1: '',
    addressLine2: '',
  });

  const [errors, setErrors] = useState<ValidationErrors<Form>>({});

  const handleChange = ({ name, value }: TextChangeParams) => {
    setErrors((prev) => {
      delete prev[name as keyof typeof prev];
      return prev;
    });
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const errors = validateRequired<Form>(form, [
      'addressLine1',
      'city',
      'state',
      'country',
      'postalCode',
    ]);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    // TODO: Implement API call to update address
    router.push('/(setup-profile)/(upload-identity)/proof-identity');
  };

  return (
    <ScreenContainer>
      <Header title="Setting Up Profile" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <SetupProfileTabs />
        <KeyboardView>
          <TextField
            name="addressLine1"
            label="Address Line 1"
            placeholder="Address Line 1"
            onChange={handleChange}
            value={form.addressLine1}
            required
            error={errors['addressLine1']}
          />
          <TextField
            name="addressLine2"
            label="Address Line 2"
            placeholder="Address Line 2"
            onChange={handleChange}
            value={form.addressLine2}
            error={errors['addressLine2']}
          />
          <Row className="gap-3">
            <TextField
              name="city"
              label="City"
              placeholder="City"
              onChange={handleChange}
              value={form.city}
              required
              error={errors['city']}
              className={classes.input}
            />
            <SelectModal
              required
              name="state"
              label="State"
              value={form.state}
              onChange={handleChange}
              options={STATES}
              error={errors['state']}
              placeholder="--Select--"
              className={classes.input}
            />
          </Row>
          <SelectModal
            required
            name="country"
            label="Country"
            value={form.country}
            onChange={handleChange}
            options={COUNTRIES}
            error={errors['country']}
            placeholder="--Select--"
            className={classes.input}
          />
          <TextField
            name="postalCode"
            label="Postal Code"
            placeholder="Postal Code"
            onChange={handleChange}
            value={form.postalCode}
            required
            error={errors['postalCode']}
          />
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            className={classes.button}
          >
            Continue
          </Button>
        </KeyboardView>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5',
  keyboardViewContent: 'flex-grow gap-3 pb-20',
  statePicker: 'border-1 border-gray-200 rounded-8 p-12 mt-8',
  formContainer: 'pb-10 flex gap-4',
  input: 'flex-1',
  button: 'mt-5',
};
