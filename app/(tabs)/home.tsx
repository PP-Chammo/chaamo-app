import { View } from 'react-native';

import { Button, Label } from '@/components/atoms';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function HomeScreen() {
  const { signOut } = useAuthStore();

  return (
    <View className={classes.container}>
      <Label>Welcome! Start building your screen here.</Label>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}

const classes = {
  container: 'flex-1 items-center justify-center gap-5',
};
