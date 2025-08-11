import React, { useCallback, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { View } from 'react-native';

import { Button, KeyboardView, Row, ScreenContainer } from '@/components/atoms';
import {
  Header,
  SelectModal,
  SetupProfileTabs,
  TextField,
} from '@/components/molecules';
import { Country, State, TextChangeParams } from '@/domains';
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

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
    router.push('/screens/setup-profile/identity/proof-identity');
  };

  const lazyLoad = useCallback(async () => {
    const countriesData = await import('@/assets/data/countries.json');
    const statesData = await import('@/assets/data/states.json');

    setStates(statesData.default);
    setCountries(countriesData.default);
  }, []);

  useFocusEffect(() => {
    lazyLoad();
  });

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
          <SelectModal
            required
            name="country"
            label="Country"
            value={form.country}
            onChange={handleChange}
            options={{
              data: countries,
              label: 'name',
              value: 'iso2',
            }}
            error={errors['country']}
            placeholder="--Select Country--"
            className={classes.input}
          />
          <Row className="gap-3">
            <SelectModal
              required
              name="state"
              label="State"
              value={form.state}
              onChange={handleChange}
              options={{
                data: states.filter(
                  (state) => state.country_code === form.country,
                ),
                label: 'name',
                value: 'iso2',
              }}
              error={errors['state']}
              placeholder="--Select State--"
              className={classes.input}
            />
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
          </Row>
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
