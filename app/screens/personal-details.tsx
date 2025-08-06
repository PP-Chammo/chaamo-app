import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { isEqual } from 'lodash';
import { Alert, View } from 'react-native';

import { Button, KeyboardView, Row, ScreenContainer } from '@/components/atoms';
import {
  Header,
  PhoneInput,
  SelectModal,
  TextField,
} from '@/components/molecules';
import { Country, State, TextChangeParams } from '@/domains';
import {
  useUpdateProfileMutation,
  useUpdateUserAddressMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { UserStore } from '@/stores/userStore';
import { DeepGet } from '@/types/helper';
import { structuredClone } from '@/utils/structuredClone';
import { validateRequired, ValidationErrors } from '@/utils/validate';

export default function PersonalDetailsScreen() {
  const [form, setForm] = useUserVar();
  const [originalForm, setOriginalForm] = useState<UserStore | null>(null);
  const [errors, setErrors] = useState<
    ValidationErrors<DeepGet<UserStore, ['profile']>>
  >({});
  const [updateProfile] = useUpdateProfileMutation();
  const [updateUserAddress] = useUpdateUserAddressMutation();

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    if (!originalForm) {
      setOriginalForm(structuredClone(form));
    }
  }, [form, originalForm]);

  const revertForm = useCallback(() => {
    if (originalForm) {
      setForm(originalForm);
    }
  }, [originalForm, setForm]);

  const handleBackPress = useCallback(() => {
    const hasChanges = !isEqual(form, originalForm);

    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              revertForm();
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
    }
  }, [form, originalForm, revertForm]);

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

  const handleUpdateProfile = () => {
    const requiredFields: (keyof DeepGet<UserStore, ['profile']>)[] = [
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

    if (Object.keys(validationErrors).length === 0) {
      const {
        id,
        username,
        country_code,
        phone_number,
        address_line_1,
        city,
        state_province,
        country,
        postal_code,
      } = form.profile ?? {};

      updateProfile({
        variables: {
          set: {
            username,
            country_code,
            phone_number,
          },
          filter: {
            id: {
              eq: id,
            },
          },
        },
        onCompleted: ({ updateprofilesCollection }) => {
          if (updateprofilesCollection?.records.length) {
            updateUserAddress({
              variables: {
                set: {
                  address_line_1,
                  city,
                  state_province,
                  country,
                  postal_code,
                },
                filter: {
                  user_id: {
                    eq: id,
                  },
                },
              },
              onCompleted: (data) => {
                if (data?.updateuser_addressesCollection?.records.length) {
                  // Update the original form after successful save
                  setOriginalForm(structuredClone(form));
                  Alert.alert(
                    'Success',
                    'Personal details updated successfully',
                  );
                }
              },
            });
          }
        },
      });
    }
  };

  const profile = form.profile;

  const filteredStates = useMemo(
    () => states.filter((state) => state.country_code === profile?.country),
    [profile?.country, states],
  );

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
      <Header title="Personal Details" onBackPress={handleBackPress} />
      <KeyboardView>
        <View className={classes.container}>
          <TextField
            label="Username"
            value={profile?.username}
            onChange={handleChange}
            name="username"
            className={classes.input}
          />
          <PhoneInput
            name="phone_number"
            value={profile?.phone_number ?? ''}
            countryCode={profile?.country_code ?? ''}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            value={form?.email ?? ''}
            onChange={handleChange}
            name="email"
            editable={false}
          />
          <TextField
            label="Address"
            value={profile?.address_line_1}
            onChange={handleChange}
            name="address_line_1"
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
            error={errors.country}
            placeholder="--Select Country--"
            className={classes.input}
          />
          <Row between className={classes.row}>
            <SelectModal
              required
              name="state_province"
              label="State"
              value={profile?.state_province ?? ''}
              onChange={handleChange}
              options={{
                data: filteredStates,
                label: 'name',
                value: 'iso2',
              }}
              error={errors.state_province}
              placeholder="--Select State--"
              className={classes.input}
            />
            <TextField
              label="City"
              value={profile?.city}
              onChange={handleChange}
              name="city"
              className={classes.input}
              required
              error={errors.city}
            />
          </Row>
          <TextField
            label="Postal Code"
            value={profile?.postal_code ?? ''}
            onChange={handleChange}
            name="postal_code"
            required
            error={errors.postal_code}
          />
        </View>
      </KeyboardView>
      <Button onPress={handleUpdateProfile} className={classes.button}>
        Save Changes
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-4',
  button: 'm-4.5',
  input: 'flex-1',
  row: 'gap-3',
};
