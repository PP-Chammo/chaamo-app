import { useEffect } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Label } from '@/components/atoms';

export default function StartPage() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animate logo scaling
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  // Navigate to /sign-in after 2 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/screens/onboarding');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className={classes.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[animatedStyle]}
      />
      <Label variant="title" className={classes.logoText}>
        Chaamo
      </Label>
    </View>
  );
}

const classes = {
  container: 'flex-1 items-center justify-center bg-white',
  logoText: 'mt-10 text-4xl',
};
