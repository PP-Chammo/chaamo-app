import React, { useEffect, useState } from 'react';

import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button, KeyboardView, Row, ScreenContainer } from '@/components/atoms';
import {
  Header,
  PhoneInput,
  SelectWithScreen,
  TextField,
} from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useSelectWithScreenVar } from '@/hooks/useSelectWithScreenVar';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
};

export default function PersonalDetailsScreen() {
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<Form>>({});

  const [selectState] = useSelectWithScreenVar();

  const handleChange = ({ name, value }: TextChangeParams) => {
    setErrors((prev) => {
      delete prev[name as keyof typeof prev];
      return prev;
    });
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const errors = validateRequired<Form>(form, [
      'city',
      'state',
      'country',
      'postalCode',
    ]);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    return Alert.alert('Success', 'Personal details updated successfully');
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      country: selectState.selectedCountry,
      state: selectState.selectedState,
    }));
  }, [selectState.selectedCountry, selectState.selectedState]);

  return (
    <ScreenContainer>
      <Header title="Personal Details" onBackPress={() => router.back()} />
      <KeyboardView>
        <View className={classes.container}>
          <Row between>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={handleChange}
              name="firstName"
              className={classes.input}
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={handleChange}
              name="lastName"
              className={classes.input}
            />
          </Row>
          <PhoneInput name="phone" value={form.phone} onChange={handleChange} />
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange}
            name="email"
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange}
            name="address"
          />
          <Row between>
            <TextField
              label="City"
              value={form.city}
              onChange={handleChange}
              name="city"
              className={classes.input}
              required
              error={errors['city']}
            />
            <SelectWithScreen
              label="State"
              onPress={() => router.push('/screens/state-picker')}
              error={errors['state']}
              placeholder="--Select--"
              value={form.state}
              required
            />
          </Row>
          <SelectWithScreen
            label="Country"
            onPress={() => router.push('/screens/country-picker')}
            error={errors['country']}
            placeholder="--Select--"
            value={form.country}
            required
          />
          <TextField
            label="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            name="postalCode"
            required
            error={errors['postalCode']}
          />
        </View>
      </KeyboardView>
      <Button onPress={handleSubmit} className={classes.button}>
        Save Changes
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-4',
  button: 'my-10 mx-4.5',
  input: 'flex-1',
};
