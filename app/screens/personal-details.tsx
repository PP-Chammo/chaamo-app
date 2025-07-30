import React, { useCallback, useState } from 'react';

import { router, useFocusEffect } from 'expo-router';
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
  useGetPersonalProfileLazyQuery,
  useUpdateProfileMutation,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  first_name: string;
  last_name: string;
  country_code: string;
  phone_number: string;
  email: string;
  address_line_1: string;
  city: string;
  state_province: string;
  country: string;
  postal_code: string;
}

const initialForm = {
  first_name: '',
  last_name: '',
  country_code: '',
  phone_number: '',
  email: '',
  address_line_1: '',
  city: '',
  state_province: '',
  country: '',
  postal_code: '',
};

export default function PersonalDetailsScreen() {
  const [profileState] = useProfileVar();
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<Form>>({});
  const [getPersonalProfile, { data, loading, error }] =
    useGetPersonalProfileLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [updateProfile] = useUpdateProfileMutation();

  const handleChange = ({ name, value }: TextChangeParams) => {
    setErrors((prev) => {
      delete prev[name as keyof typeof prev];
      return prev;
    });
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = () => {
    const errors = validateRequired<Form>(form, [
      'city',
      'state_province',
      'country',
      'postal_code',
    ]);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const { first_name, last_name, country_code, phone_number } = form;

    updateProfile({
      variables: {
        set: {
          first_name,
          last_name,
          country_code,
          phone_number,
        },
        filter: {
          id: {
            eq: profileState?.id,
          },
        },
      },
      onCompleted: (data) => {
        console.log({ data: data?.updateprofilesCollection?.records });
        Alert.alert('Success', 'Personal details updated successfully');
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      getPersonalProfile({
        variables: {
          filter: {
            user_id: {
              eq: profileState?.id,
            },
          },
        },
      });

      if (data && !loading && !error) {
        const userData = data?.user_addressesCollection?.edges?.[0]?.node;
        const profileData = userData?.profiles;

        setForm((prev) => ({
          ...prev,
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          country_code: profileData?.country_code || '',
          phone_number: profileData?.phone_number || '',
          address_line_1: userData?.address_line_1 || '',
          city: userData?.city || '',
          state_province: userData?.state_province || '',
          country: userData?.country || '',
          postal_code: userData?.postal_code || '',
          email: profileState?.email || '',
        }));
      }
    }, [
      data,
      error,
      getPersonalProfile,
      loading,
      profileState?.email,
      profileState?.id,
    ]),
  );

  return (
    <ScreenContainer>
      <Header title="Personal Details" onBackPress={() => router.back()} />
      <KeyboardView>
        <View className={classes.container}>
          <Row between className={classes.row}>
            <TextField
              label="First Name"
              value={form.first_name}
              onChange={handleChange}
              name="first_name"
              className={classes.input}
            />
            <TextField
              label="Last Name"
              value={form.last_name}
              onChange={handleChange}
              name="last_name"
              className={classes.input}
            />
          </Row>
          <PhoneInput
            name="phone_number"
            value={form.phone_number}
            countryCode={form.country_code}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange}
            name="email"
            editable={false}
          />
          <TextField
            label="Address"
            value={form.address_line_1}
            onChange={handleChange}
            name="address_line_1"
          />
          <Row between className={classes.row}>
            <TextField
              label="City"
              value={form.city}
              onChange={handleChange}
              name="city"
              className={classes.input}
              required
              error={errors['city']}
            />
            <SelectModal
              required
              name="state_province"
              label="State"
              value={form.state_province}
              onChange={handleChange}
              options={STATES}
              error={errors['state_province']}
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
            label="Postal Code"
            value={form.postal_code}
            onChange={handleChange}
            name="postal_code"
            required
            error={errors['postal_code']}
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
