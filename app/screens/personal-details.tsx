import React, { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button, KeyboardView, Row, ScreenContainer } from '@/components/atoms';
import {
  Header,
  PhoneInput,
  SelectModal,
  TextField,
} from '@/components/molecules';
import { COUNTRIES, STATES } from '@/constants/dummy';
import { TextChangeParams } from '@/domains';
import {
  useUpdateProfileMutation,
  useUpdateUserAddressMutation,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { ProfileStore } from '@/stores/profileStore';
import { DeepGet } from '@/types/helper';
import { validateRequired, ValidationErrors } from '@/utils/validate';

export default function PersonalDetailsScreen() {
  const [form, setForm] = useProfileVar();
  const [errors, setErrors] = useState<
    ValidationErrors<DeepGet<ProfileStore, ['profile']>>
  >({});
  const [updateProfile] = useUpdateProfileMutation();
  const [updateUserAddress] = useUpdateUserAddressMutation();

  const handleChange = useCallback(
    ({ name, value }: TextChangeParams) => {
      setErrors((prev) => {
        delete prev[name as keyof typeof prev];
        return prev;
      });

      setForm({
        ...form,
        profile: { ...form.profile, [name]: value } as DeepGet<
          ProfileStore,
          ['profile']
        >,
      });
    },
    [form, setForm],
  );

  const handleUpdateProfile = () => {
    const requiredFields: (keyof DeepGet<ProfileStore, ['profile']>)[] = [
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

  return (
    <ScreenContainer>
      <Header title="Personal Details" onBackPress={() => router.back()} />
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
          <Row between className={classes.row}>
            <TextField
              label="City"
              value={profile?.city}
              onChange={handleChange}
              name="city"
              className={classes.input}
              required
              error={errors.city}
            />
            <SelectModal
              required
              name="state_province"
              label="State"
              value={profile?.state_province ?? ''}
              onChange={handleChange}
              options={STATES}
              error={errors.state_province}
              placeholder="--Select--"
              className={classes.input}
            />
          </Row>
          <SelectModal
            required
            name="country"
            label="Country"
            value={profile?.country ?? ''}
            onChange={handleChange}
            options={COUNTRIES}
            error={errors.country}
            placeholder="--Select--"
            className={classes.input}
          />
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
