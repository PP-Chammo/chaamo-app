import React, { useState } from 'react';

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
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  image: string;
}

export default function PersonalInfoScreen() {
  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    image: '',
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
      'firstName',
      'lastName',
      'email',
      'phone',
      'password',
      'confirmPassword',
    ]);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    // TODO: Implement API call to update user info
    router.push('/(setup-profile)/address');
  };

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

    setForm((prev) => ({ ...prev, image: selectedImage.uri }));
  };

  return (
    <ScreenContainer className={classes.container}>
      <Header title="Setting Up Profile" onBackPress={() => router.back()} />
      <SetupProfileTabs />
      <KeyboardView className={classes.formContainer}>
        <Avatar
          size={120}
          onPress={handleImagePick}
          imageUrl={form.image}
          imageContainerClassName={classes.imageContainer}
          className={classes.image}
        />
        <View className="gap-4 flex-row w-full">
          <TextField
            name="firstName"
            label="First Name"
            placeholder="First Name"
            onChange={handleChange}
            value={form.firstName}
            required
            error={errors['firstName']}
          />
          <TextField
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            onChange={handleChange}
            value={form.lastName}
            required
            error={errors['lastName']}
          />
        </View>
        <View className="gap-4 flex-1">
          <TextField
            name="email"
            label="Email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            error={errors['email']}
          />
          <PhoneInput name="phone" value={form.phone} onChange={handleChange} />
          <TextField
            name="password"
            label="Password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            type="password"
            error={errors['password']}
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={form.confirmPassword}
            required
            type="password"
            error={errors['confirmPassword']}
          />
        </View>
      </KeyboardView>
      <Button variant="primary" size="large" onPress={handleSubmit}>
        Continue
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-6',
  image: 'mb-12',
  imageContainer: 'p-1',
  formContainer: 'pb-10 justify-center items-center',
};
