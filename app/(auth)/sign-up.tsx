import { useState } from 'react';

import { Link, router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Label } from '@/components/atoms';
import { Header, PhoneInput } from '@/components/molecules';
import { InputChangeParams } from '@/domains';

const SignUpScreen = () => {
  const [form, setForm] = useState({
    phone: '',
  });

  const handleChange = ({ name, value }: InputChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendVerification = () => {
    router.push('/(auth)/otp-verification');
  };

  return (
    <SafeAreaView className={classes.container}>
      <Header title="Sign Up" />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Let&apos;s get started!
        </Label>
        <Label className={classes.description}>
          To get started, create an account. This will helps us keep your
          financial information safe and secure
        </Label>
        <PhoneInput name="phone" value={form.phone} onChange={handleChange} />
        <Button
          disabled={!form.phone.length}
          onPress={handleSendVerification}
          className={classes.sendButton}
        >
          Send Verification Code
        </Button>
        <Label className={classes.login}>
          Already have an account?{' '}
          <Link className={classes.link} href="/sign-in">
            Login
          </Link>
        </Label>
      </View>
      <Label className={classes.terms}>
        By signing up, you agree to CHAAMO&apos;s{' '}
        <Link className={classes.link} href="/sign-up">
          Terms of Service
        </Link>{' '}
        and acknowledge you&apos;ve read our{' '}
        <Link className={classes.link} href="/sign-up">
          Privacy Policy
        </Link>
      </Label>
    </SafeAreaView>
  );
};

const classes = {
  container: 'flex-1 bg-gray-100 dark:bg-gray-900 mx-5',
  form: 'flex-1 mt-[50] gap-5',
  title: 'text-2xl font-bold text-teal-600 mb-2',
  description: 'text-gray-500 text-md mb-8',
  login: 'text-gray-500 text-md text-center',
  link: 'text-teal-600 underline font-bold',
  sendButton: 'my-2',
  terms: 'text-gray-500 text-md mb-12',
};

export default SignUpScreen;
