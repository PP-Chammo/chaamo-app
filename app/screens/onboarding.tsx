import { useState } from 'react';

import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ImageBackground, View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Checkbox } from '@/components/molecules';
import { BooleanChangeParams } from '@/domains';

export default function OnboardingScreen() {
  const [form, setForm] = useState({
    terms: false,
  });

  const handleChange = ({ name, value }: BooleanChangeParams) => {
    setForm({ ...form, [name]: value });
  };

  cssInterop(BlurView, {
    className: {
      target: 'style',
    },
  });

  return (
    <ScreenContainer>
      <ImageBackground
        source={require('@/assets/images/bg-onboarding.png')}
        className={classes.background}
        resizeMode="contain"
      />
      <View className={classes.content}>
        <BlurView intensity={150} className={classes.blurView}>
          <View className={classes.logo}>
            <Image
              source={require('@/assets/images/logo.png')}
              className={classes.logoImage}
            />
            <Label variant="title" className={classes.greetingText}>
              Welcome to
              <Label variant="title" className={classes.logoText}>
                {' '}
                CHAAMO
              </Label>
            </Label>
          </View>
          <View className={classes.buttons}>
            <Button
              disabled={!form.terms}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              Sign Up
            </Button>
            <Button
              disabled={!form.terms}
              onPress={() => router.push('/(auth)/sign-in')}
              variant="primary-light"
            >
              Login
            </Button>
          </View>
          <View className={classes.termsContainer}>
            <Checkbox checked={form.terms} onChange={handleChange} name="terms">
              <Label className={classes.terms}>
                By continuing, you agree to CHAAMO&apos;s{' '}
                <Link
                  className={classes.link}
                  href="https://chaamo.com/terms-of-service"
                >
                  Terms of Service,
                </Link>
                {''}
                <Link className={classes.link} href="https://chaamo.com/eula">
                  EULA
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
          </View>
        </BlurView>
        <View className={classes.footer} />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  background: 'flex-1 absolute top-0 left-0 right-0 bottom-44',
  link: 'text-primary-500 underline font-bold',
  terms: 'text-slate-500 text-sm',
  content: 'flex-1 justify-end',
  logo: 'items-center gap-2 mb-10',
  logoImage: 'w-20 h-20',
  buttons: 'gap-5',
  greetingText: 'text-[28px] font-medium mt-2',
  logoText: 'text-[30px] text-yellow-600',
  blurView: 'p-4 z-20',
  termsContainer:
    'my-5 bg-primary-100 border border-primary-400 py-3 px-2 rounded-xl',
  footer: 'h-56 w-full absolute bottom-0 z-0 bg-white',
};
