import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { ChatList } from '@/components/organisms';

export default function AllInboxScreen() {
  const handlePress = (id: number, name: string) => {
    router.push(`/screens/chat?id=${id}&name=${name}`);
  };

  return (
    <ScreenContainer>
      <ChatList onPress={handlePress} />
    </ScreenContainer>
  );
}
