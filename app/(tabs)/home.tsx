import { Button, Label, ScreenContainer } from '@/components/atoms';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function HomeScreen() {
  const { signOut } = useAuthStore();

  return (
    <ScreenContainer>
      <Label>Welcome! Start building your screen here.</Label>
      <Button onPress={signOut}>Sign Out</Button>
    </ScreenContainer>
  );
}
