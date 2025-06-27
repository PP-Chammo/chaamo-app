import React, { memo, useState } from 'react';

import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Label } from '@/components/atoms';
import { Header, PhoneInput } from '@/components/molecules';
import { InputChangeParams } from '@/domains';

interface ForgotPassword {
  phone: string;
}

const ForgotPasswordScreen = memo(() => {
  const [form, setForm] = useState<ForgotPassword>({
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
    <SafeAreaView className={classes.container}>
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
    </SafeAreaView>
  );
});

const classes = {
  container: 'flex-1 bg-slate-100 dark:bg-slate-900 mx-5',
  form: 'flex-1 mt-[50] gap-3',
  inputContainer: 'gap-6',
  title: 'text-2xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-lg mb-6',
  login: 'text-slate-500 text-md text-center underline font-bold',
  link: 'text-teal-600 underline font-bold',
  resetButton: 'my-4',
  signUp: 'text-slate-500 text-md text-center mb-8',
  errorText: 'text-red-500 text-sm',
};

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';

export default ForgotPasswordScreen;
