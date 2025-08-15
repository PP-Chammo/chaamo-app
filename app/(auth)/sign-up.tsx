import { useCallback, useState } from 'react';

import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Checkbox, Header } from '@/components/molecules';
import { useUserVar } from '@/hooks/useUserVar';
import { loginWithGoogle, updateProfileSession } from '@/utils/auth';

export default function SignUpScreen() {
  const [, setUser] = useUserVar();

  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);

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
      <Header title="Sign Up" onBackPress={() => router.back()} />
      <View className={classes.form}>
        <Label className={classes.title} variant="title">
          Let&apos;s get started!
        </Label>
        <Label className={classes.description}>
          To get started, create an account. This will helps us keep your
          financial information safe and secure
        </Label>
        <Button
          disabled={!terms || loading}
          icon="google"
          onPress={handleGoogleLogin}
          variant="primary-light"
        >
          Continue with Google
        </Button>
      </View>
      <Checkbox
        className="mb-12 px-4.5"
        checked={terms}
        onChange={() => setTerms(!terms)}
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
  orLabel: 'text-center !text-slate-400',
};
