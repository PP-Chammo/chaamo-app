import React, { useEffect, useState } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, KeyboardView, ScreenContainer } from '@/components/atoms';
import {
  Header,
  SelectWithScreen,
  SetupProfileTabs,
  TextField,
} from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useSelectWithScreenStore } from '@/hooks/useSelectWithScreenStore';
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

  const { selectedCountry, selectedState } = useSelectWithScreenStore();

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

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      country: selectedCountry,
      state: selectedState,
    }));
  }, [selectedCountry, selectedState]);

  return (
    <ScreenContainer className={classes.container}>
      <Header title="Setting Up Profile" onBackPress={() => router.back()} />
      <SetupProfileTabs />
      <KeyboardView>
        <View className={classes.formContainer}>
          <View className="gap-4 flex-1">
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
          </View>
          <View className="gap-4 flex-row w-full">
            <TextField
              name="city"
              label="City"
              placeholder="City"
              onChange={handleChange}
              value={form.city}
              required
              error={errors['city']}
            />
            <SelectWithScreen
              label="State"
              onPress={() => router.push('/(setup-profile)/state-picker')}
              error={errors['state']}
              placeholder="--Select--"
              value={form.state}
            />
          </View>
          <View className="gap-4 flex-1">
            <SelectWithScreen
              label="Country"
              onPress={() => router.push('/(setup-profile)/country-picker')}
              error={errors['country']}
              placeholder="--Select--"
              value={form.country}
            />
            <TextField
              name="postalCode"
              label="PostalCode"
              placeholder="PostalCode"
              onChange={handleChange}
              value={form.postalCode}
              required
              error={errors['postalCode']}
            />
          </View>
        </View>
      </KeyboardView>
      <Button variant="primary" size="large" onPress={handleSubmit}>
        Continue
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'p-6',
  statePicker: 'border-1 border-gray-200 rounded-8 p-12 mt-8',
  formContainer: 'pb-10 flex gap-4',
};
