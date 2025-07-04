import { BlurView } from 'expo-blur';
import { Link, router } from 'expo-router';
import { Image, ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Label } from '@/components/atoms';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require('@/assets/images/bg-onboarding.png')}
        className="flex-1 m-1"
      >
        <View className="flex-1 justify-end">
          <BlurView
            intensity={100}
            tint="light"
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: 'hidden',
              padding: 24,
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <View className="items-center gap-2 mb-10">
              <Image
                source={require('@/assets/images/logo.png')}
                className="w-20 h-20"
              />
              <Label variant="title" className="text-[24px]">
                Welcome to
                <Label variant="title" className="text-[26px] text-yellow-500">
                  {' '}
                  Chaamo
                </Label>
              </Label>
            </View>
            <View className="gap-5">
              <Button onPress={() => router.push('/(auth)/sign-up')}>
                Signup
              </Button>
              <Button
                onPress={() => router.push('/(auth)/sign-in')}
                variant="primary-light"
              >
                Login
              </Button>
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
          </BlurView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const classes = {
  link: 'text-teal-600 underline font-bold',
  terms: 'text-slate-500 text-md mt-10',
};
