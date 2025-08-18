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
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { UserStore } from '@/stores/userStore';
import { DeepGet } from '@/types/helper';
import { validateRequired, ValidationErrors } from '@/utils/validate';

export default function AddressScreen() {
  const [form, setForm] = useUserVar();
  const profile = form?.profile;

  const [errors, setErrors] = useState<
    ValidationErrors<DeepGet<UserStore, ['profile']>>
  >({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const [updateUserAddress, { loading: isUpdatingUserAddress }] =
    useUpdateUserAddressMutation();
  const [createUserAddress, { loading: isCreatingUserAddress }] =
    useCreateUserAddressMutation();

  const handleChange = useCallback(
    ({ name, value }: TextChangeParams) => {
      setErrors((prev) => {
        delete prev[name as keyof typeof prev];
        return prev;
      });

      setForm({
        ...form,
        profile: { ...form.profile, [name]: value } as DeepGet<
          UserStore,
          ['profile']
        >,
      });
    },
    [form, setForm],
  );

  const handleSubmit = useCallback(() => {
    const requiredFields: (keyof DeepGet<UserStore, ['profile']>)[] = [
      'address_line_1',
      'city',
      'state_province',
      'country',
      'postal_code',
    ];

    const validationErrors = validateRequired(
      form.profile as unknown as Record<string, string>,
      requiredFields,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!!profile?.user_addresses_id) {
      updateUserAddress({
        variables: {
          set: {
            address_line_1: form.profile?.address_line_1 ?? '',
            city: form.profile?.city ?? '',
            state_province: form.profile?.state_province ?? '',
            country: form.profile?.country ?? '',
            postal_code: form.profile?.postal_code ?? '',
          },
          filter: {
            user_id: {
              eq: profile?.id,
            },
          },
        },
        onCompleted: ({ updateuser_addressesCollection }) => {
          if (updateuser_addressesCollection?.records?.length) {
            router.push('/screens/setup-profile/document-upload-selection');
          }
        },
      });
    } else {
      createUserAddress({
        variables: {
          objects: [
            {
              user_id: profile?.id,
              address_line_1: form.profile?.address_line_1 ?? '',
              city: form.profile?.city ?? '',
              state_province: form.profile?.state_province ?? '',
              country: form.profile?.country ?? '',
              postal_code: form.profile?.postal_code ?? '',
            },
          ],
        },
        onCompleted: ({ insertIntouser_addressesCollection }) => {
          if (insertIntouser_addressesCollection?.records?.length) {
            router.push('/screens/setup-profile/document-upload-selection');
          }
        },
      });
    }
  }, [
    createUserAddress,
    form.profile,
    profile?.id,
    profile?.user_addresses_id,
    updateUserAddress,
  ]);

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
            name="address_line_1"
            label="Address Line 1"
            placeholder="Address Line 1"
            onChange={handleChange}
            value={profile?.address_line_1 ?? ''}
            required
            error={errors?.address_line_1}
          />
          <SelectModal
            required
            name="country"
            label="Country"
            value={profile?.country ?? ''}
            onChange={handleChange}
            options={{
              data: countries,
              label: 'name',
              value: 'iso2',
            }}
            error={errors?.country}
            placeholder="--Select Country--"
            className={classes.input}
          />
          <Row className="gap-3">
            <SelectModal
              required
              name="state_province"
              label="State"
              value={profile?.state_province ?? ''}
              onChange={handleChange}
              options={{
                data: states.filter(
                  (state) => state.country_code === profile?.country,
                ),
                label: 'name',
                value: 'iso2',
              }}
              error={errors?.state_province}
              placeholder="--Select State--"
              className={classes.input}
            />
            <TextField
              name="city"
              label="City"
              placeholder="City"
              onChange={handleChange}
              value={profile?.city ?? ''}
              required
              error={errors?.city}
              className={classes.input}
            />
          </Row>
          <TextField
            name="postal_code"
            label="Postal Code"
            placeholder="Postal Code"
            onChange={handleChange}
            value={profile?.postal_code ?? ''}
            required
            error={errors?.postal_code}
          />
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            className={classes.button}
            disabled={isUpdatingUserAddress || isCreatingUserAddress}
            loading={isUpdatingUserAddress || isCreatingUserAddress}
          >
            Continue
          </Button>
        </KeyboardView>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-4.5',
  statePicker: 'border-1 border-gray-200 rounded-8 p-12 mt-8',
  input: 'flex-1',
  button: 'mt-5',
};
