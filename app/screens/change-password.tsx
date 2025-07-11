import React, { useState } from 'react';

import { Link, router } from 'expo-router';
import { Alert, View } from 'react-native';

import { Button, ScreenContainer } from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  validateRequired,
  ValidationErrors,
  ValidationValues,
} from '@/utils/validate';

interface Form extends ValidationValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const initialForm = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function ChangePasswordScreen() {
  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors<Form>>({});

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const errors = validateRequired<Form>(form, [
      'currentPassword',
      'newPassword',
      'confirmNewPassword',
    ]);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    return Alert.alert('Success', 'Password changed successfully');
  };

  return (
    <ScreenContainer>
      <Header title="Change Password" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <TextField
          label="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          name="currentPassword"
          type="password"
          required
          error={errors['currentPassword']}
        />
        <TextField
          label="New Password"
          value={form.newPassword}
          onChange={handleChange}
          name="newPassword"
          type="password"
          required
          error={errors['newPassword']}
        />
        <TextField
          label="Re-type Password"
          value={form.confirmNewPassword}
          onChange={handleChange}
          name="confirmNewPassword"
          type="password"
          required
          error={errors['confirmNewPassword']}
        />
        <Link className={classes.login} href="/forgot-password">
          Forgot Password?
        </Link>
      </View>
      <Button className={classes.button} onPress={handleSubmit}>
        Change Password
      </Button>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 p-4.5 gap-4',
  login: 'text-slate-500 text-md underline font-bold',
  button: 'my-10 mx-4.5',
};
