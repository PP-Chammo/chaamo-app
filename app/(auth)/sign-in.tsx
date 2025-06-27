import { useState } from 'react';

import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Label } from '@/components/atoms';
import { Header, PhoneInput, TextField } from '@/components/molecules';
import { InputChangeParams } from '@/domains';

interface SignInForm {
  phone: string;
  password: string;
}

const SignInScreen = () => {
  const [form, setForm] = useState<SignInForm>({
    phone: '',
    password: '',
  });
  const [errorText, setErrorText] = useState<string>('');

  const handleChange = ({ name, value }: InputChangeParams) => {
    setErrorText('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const phone = '+44123456';
    const password = '123456';
    if (password !== form.password || phone !== form.phone)
      return setErrorText('Incorrect number or password');
    return router.push('/(auth)/otp-verification');
  };

  return (
    <SafeAreaView className={classes.container}>
      <Header title="Login" />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Welcome Back!
        </Label>
        <Label className={classes.description}>
          Please enter your credentials below to login.
        </Label>
        <View className={classes.inputContainer}>
          <PhoneInput name="phone" value={form.phone} onChange={handleChange} />
          <TextField
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            name="password"
            type="password"
            required
          />
        </View>
        {errorText && <Text className={classes.errorText}>{errorText}</Text>}
        <Button
          disabled={!form.phone.length || !form.password}
          onPress={handleLogin}
          className={classes.loginButton}
        >
          Login
        </Button>
        <Link className={classes.login} href="/forgot-password">
          Forgot Password?
        </Link>
      </View>
      <Label className={classes.signUp}>
        Don&apos;t have an account?{' '}
        <Link className={classes.link} href="/sign-up">
          Sign Up
        </Link>
      </Label>
    </SafeAreaView>
  );
};

const classes = {
  container: 'flex-1 bg-slate-100 dark:bg-slate-900 mx-5',
  form: 'flex-1 mt-[50] gap-3',
  inputContainer: 'gap-6',
  title: 'text-3xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-lg mb-6',
  login: 'text-slate-500 text-md text-center underline font-bold',
  link: 'text-teal-600 underline font-bold',
  loginButton: 'my-2 ',
  signUp: 'text-slate-500 text-md text-center mb-8',
  errorText: 'text-red-500 text-sm',
};

export default SignInScreen;
