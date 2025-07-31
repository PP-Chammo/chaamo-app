import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

cssInterop(Image, {
  className: {
    target: 'style',
  },
});

export default function StartPage() {
  return (
    <View className={classes.container}>
      <Image
        source={require('@/assets/images/splash-screen.gif')}
        className={classes.image}
        contentFit="contain"
      />
    </View>
  );
}

const classes = {
  container: 'bg-splash w-full h-full',
  image: 'absolute inset-0',
};
