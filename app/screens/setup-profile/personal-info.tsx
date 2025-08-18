import React, { useCallback, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import {
  Avatar,
  Button,
  KeyboardView,
  ScreenContainer,
} from '@/components/atoms';
import {
  Header,
  PhoneInput,
  SetupProfileTabs,
  TextField,
} from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useUpdateProfileMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { UserStore } from '@/stores/userStore';
import { DeepGet } from '@/types/helper';
import { logout } from '@/utils/auth';
import { uploadToBucket } from '@/utils/supabase';
import { validateRequired, ValidationErrors } from '@/utils/validate';

export default function PersonalInfoScreen() {
  const [form, setForm] = useUserVar();
  const [errors, setErrors] = useState<
    ValidationErrors<DeepGet<UserStore, ['profile']>>
  >({});

  const profile = form?.profile;

  const [updateProfile, { loading }] = useUpdateProfileMutation();

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

  const handleSubmit = useCallback(async () => {
    const requiredFields: (keyof DeepGet<UserStore, ['profile']>)[] = [
      'username',
      'phone_number',
    ];

    const validationErrors = validateRequired(
      { ...form.profile, email: profile?.email } as unknown as Record<
        string,
        string
      >,
      requiredFields,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await updateProfile({
        variables: {
          set: {
            username: form.profile?.username ?? '',
            phone_number: form.profile?.phone_number ?? '',
            country_code: form.profile?.country_code ?? '',
          },
        },
      });
      router.push('/screens/setup-profile/address');
    }
  }, [form.profile, profile?.email, updateProfile]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      return Alert.alert(
        'Permission required',
        'We need permission to access your photos.',
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets.length)
      return Alert.alert('No image selected');

    const selectedImage = result.assets[0];

    if (selectedImage?.uri) {
      const uploadedUrl = await uploadToBucket(
        selectedImage.uri,
        'chaamo',
        'profiles',
      );

      updateProfile({
        variables: {
          filter: {
            id: { eq: form?.id },
          },
          set: {
            profile_image_url: uploadedUrl,
          },
        },
        onCompleted: ({ updateprofilesCollection }) => {
          if (updateprofilesCollection?.records?.length) {
            setForm({
              ...form,
              profile: {
                ...profile,
                profile_image_url: uploadedUrl,
              },
            });
          }
        },
      });
    }
  };

  return (
    <ScreenContainer>
      <Header title="Setting Up Profile" onBackPress={logout} />
      <View className={classes.container}>
        <SetupProfileTabs />
        <KeyboardView>
          <Avatar
            size="xl"
            onPress={handleImagePick}
            imageUrl={profile?.profile_image_url ?? ''}
            imageContainerClassName={classes.imageContainer}
            className={classes.image}
          />
          <TextField
            name="username"
            label="Username"
            placeholder="Username"
            onChange={handleChange}
            value={profile?.username ?? ''}
            required
            error={errors['username']}
            className={classes.input}
          />
          <TextField
            name="email"
            label="Email"
            placeholder="Email"
            onChange={handleChange}
            required
            error={errors['email']}
            className={classes.input}
            value={form?.email ?? ''}
            editable={false}
          />
          <PhoneInput
            name="phone_number"
            value={profile?.phone_number ?? ''}
            countryCode={profile?.country_code ?? ''}
            onChange={handleChange}
            error={errors.phone_number}
          />
        </KeyboardView>
        <Button
          className={classes.button}
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Continue
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-4.5',
  image: 'mb-12',
  imageContainer: 'p-1',
  button: 'mb-12',
  input: 'flex-1',
};
