import { useState } from 'react';

import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Checkbox, Header, PhoneInput } from '@/components/molecules';
import { BooleanChangeParams, TextChangeParams } from '@/domains';
import { loginWithGoogle } from '@/utils/auth';

export default function SignUpScreen() {
  const [form, setForm] = useState({
    phone: '',
    terms: false,
  });

  const handleChange = ({
    name,
    value,
  }: TextChangeParams | BooleanChangeParams) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendVerification = () => {
    router.push('/(auth)/otp-verification');
  };

  return (
    <ScreenContainer>
      <Header title="Sign Up" onBackPress={() => router.back()} />
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
        <Label className="text-center !text-slate-400">Or</Label>
        <Button icon="google" onPress={loginWithGoogle} variant="primary-light">
          Continue with Google
        </Button>
      </View>
      <Checkbox
        className="mb-12 px-4.5"
        checked={form.terms}
        onChange={handleChange}
        name="terms"
      >
        <Label className={classes.terms}>
          By signing up, you agree to CHAAMO&apos;s{' '}
          <Link
            className={classes.link}
            href="https://chaamo.com/terms-of-service"
          >
            Terms of Service
          </Link>{' '}
          and acknowledge you&apos;ve read our{' '}
          <Link
            className={classes.link}
            href="https://chaamo.com/privacy-policy"
          >
            Privacy Policy
          </Link>
        </Label>
      </Checkbox>
    </ScreenContainer>
  );
}

const classes = {
  form: 'flex-1 mt-[50] gap-5 px-4.5',
  title: 'text-3xl font-bold text-primary-500 mb-2',
  description: 'text-slate-500 text-lg mb-8',
  login: 'text-slate-500 text-md text-center',
  link: 'text-primary-500 underline font-bold',
  sendButton: 'my-2',
  terms: 'text-slate-500 text-md ',
};
