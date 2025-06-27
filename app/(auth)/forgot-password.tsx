import React, { useState } from 'react';

import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, PhoneInput } from '@/components/molecules';
import { InputChangeParams } from '@/domains';

interface ForgotPasswordForm {
  phone: string;
}

export default function ForgotPasswordScreen() {
  const [form, setForm] = useState<ForgotPasswordForm>({
    phone: '',
  });

  const [errorText, setErrorText] = useState<string>('');

  const handleChange = ({ name, value }: InputChangeParams) => {
    setErrorText('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = () => {
    const phone = '+44123456';

    if (phone !== form.phone)
      return setErrorText('Entered mobile number is incorrect.');

    return router.push('/(auth)/otp-verification');
  };

  return (
    <ScreenContainer>
      <Header title="Forgot Password" onBackPress={() => router.back()} />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Reset Your Password
        </Label>
        <Label className={classes.description}>
          Please enter the mobile number you registered with below.
        </Label>
        <PhoneInput name="phone" value={form.phone} onChange={handleChange} />
        {errorText && <Text className={classes.errorText}>{errorText}</Text>}
        <Button
          disabled={!form.phone.length}
          onPress={handleResetPassword}
          className={classes.resetButton}
        >
          Continue
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  form: 'flex-1 mt-[50] gap-3',
  title: 'text-2xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-lg mb-6',
  resetButton: 'my-4',
  errorText: 'text-red-500 text-sm',
};
