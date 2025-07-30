import React, { useEffect, useState } from 'react';

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
  useGetPersonalProfileLazyQuery,
  useUpdateProfileMutation,
  useUpdateUserAddressMutation,
} from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { cache } from '@/utils/apollo';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  username: string;
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
  username: '',
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
  const [updateUserAddress] = useUpdateUserAddressMutation();

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

    const {
      username,
      country_code,
      phone_number,
      address_line_1,
      city,
      state_province,
      country,
      postal_code,
    } = form;

    updateProfile({
      variables: {
        set: {
          username,
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
        const updatedProfile = data?.updateprofilesCollection?.records[0];
        cache.modify({
          fields: {
            profilesCollection(existingData) {
              return {
                ...existingData,
                edges: [...existingData.edges, { node: updatedProfile }],
              };
            },
          },
        });

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
                eq: profileState?.id,
              },
            },
          },
          onCompleted: (data) => {
            if (data?.updateuser_addressesCollection?.records.length) {
              Alert.alert('Success', 'Personal details updated successfully');
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    getPersonalProfile({
      variables: {
        filter: {
          user_id: {
            eq: profileState?.id,
          },
        },
      },
    });
  }, [getPersonalProfile, profileState?.id]);

  useEffect(() => {
    if (data && !loading && !error) {
      const userData = data?.user_addressesCollection?.edges?.[0]?.node;
      const profileData = userData?.profiles;

      setForm((prev) => ({
        ...prev,
        username: profileData?.username || '',
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
  }, [data, error, loading, profileState?.email]);

  return (
    <ScreenContainer>
      <Header title="Personal Details" onBackPress={() => router.back()} />
      <KeyboardView>
        <View className={classes.container}>
          <TextField
            label="Username"
            value={form.username}
            onChange={handleChange}
            name="username"
            className={classes.input}
          />
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
