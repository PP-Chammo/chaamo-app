import { useCallback, useState } from 'react';

import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { useUserVar } from '@/hooks/useUserVar';
import { loginWithGoogle, updateProfileSession } from '@/utils/auth';

export default function SignInScreen() {
  const [, setUser] = useUserVar();

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      await updateProfileSession(setUser, (isSuccess) => {
        setLoading(false);
        if (isSuccess) {
          return router.replace('/(tabs)/home');
        }
      });
    } catch (e: unknown) {
      setLoading(false);
      console.error(e);
    }
  }, [setUser]);

  return (
    <ScreenContainer>
      <Header
        title="Login"
        onBackPress={() => router.push('/screens/onboarding')}
      />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Welcome Back!
        </Label>
        <Label className={classes.description}>
          Please enter your credentials below to login.
        </Label>
        <Button
          icon="google"
          onPress={handleGoogleLogin}
          variant="primary-light"
          loading={loading}
          disabled={loading}
        >
          Continue with Google
        </Button>
      </View>

      <Label className={classes.signUp}>
        Don&apos;t have an account?{' '}
        <Link className={classes.link} href="/sign-up">
          Sign Up
        </Link>
      </Label>
    </ScreenContainer>
  );
}

const classes = {
  form: 'flex-1 mt-[50px] gap-3 px-4.5',
  inputContainer: 'gap-6',
  title: 'text-3xl font-bold text-primary-500',
  description: 'text-slate-500 font-medium text-lg mb-6',
  login: 'text-slate-500 text-md text-center underline font-bold self-center',
  link: 'text-primary-500 underline font-bold',
  loginButton: 'my-2',
  signUp: 'text-slate-500 text-md text-center mb-8',
  errorText: 'text-red-500 text-sm',
  orLabel: 'text-center !text-slate-400',
};
