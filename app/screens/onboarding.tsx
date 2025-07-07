import { useState } from 'react';

import { BlurView } from 'expo-blur';
import { Link, router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Image, ImageBackground, SafeAreaView, View } from 'react-native';

import { Button, Label } from '@/components/atoms';
import { Checkbox } from '@/components/molecules';
import { BooleanChangeParams } from '@/domains/input.types';

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
    <SafeAreaView className={classes.container}>
      <ImageBackground
        source={require('@/assets/images/bg-onboarding.png')}
        className={classes.background}
      >
        <View className={classes.content}>
          <BlurView intensity={100} className={classes.blurView}>
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
              <Checkbox
                checked={form.terms}
                onChange={handleChange}
                name="terms"
              >
                <Label className={classes.terms}>
                  By continuing, you agree to CHAAMO&apos;s{' '}
                  <Link
                    className={classes.link}
                    href="https://chaamo.com/terms-of-service"
                  >
                    Terms of Service,
                  </Link>{' '}
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
          <BlurView intensity={100} className={classes.bottomBlurView} />
          <View className={classes.footer} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const classes = {
  container: 'flex-1',
  background: 'flex-1',
  link: 'text-teal-600 underline font-bold',
  terms: 'text-slate-500 text-sm',
  content: 'flex-1 justify-end',
  logo: 'items-center gap-2 mb-10',
  logoImage: 'w-20 h-20',
  buttons: 'gap-5',
  greetingText: 'text-[28px] font-medium mt-2',
  logoText: 'text-[30px] text-yellow-600',
  blurView: 'p-4 z-20',
  termsContainer: 'my-5 bg-teal-100 border border-teal-400 p-5 rounded-xl',
  footer: 'h-56 w-full absolute bottom-0 z-0 bg-white',
  bottomBlurView: 'absolute bottom-56 h-56 left-0 right-0 z-0',
};
