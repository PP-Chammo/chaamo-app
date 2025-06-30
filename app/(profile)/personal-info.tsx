import React, { useState } from 'react';

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, KeyboardView, ScreenContainer } from '@/components/atoms';
import { PhoneInput, TextField } from '@/components/molecules';
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
}

export default function PersonalInfoScreen() {
  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    router.push('/(profile)/address');
  };

  return (
    <ScreenContainer className="flex-1 pb-24">
      <KeyboardView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className={classes.formContainer}>
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
              <PhoneInput
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
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
          </View>
        </ScrollView>
      </KeyboardView>
      <Button
        className={classes.saveButton}
        variant="primary"
        size="large"
        onPress={handleSubmit}
      >
        Continue
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  formContainer: 'flex-1 gap-4 pb-10',
  saveButton: 'mb-4',
};
