import { router } from 'expo-router';

import { ScreenContainer } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { ChatList } from '@/components/organisms';

export default function InboxLayout() {
  const handlePress = (id: number, name: string) => {
    router.push(`/screens/chat?id=${id}&name=${name}`);
  };
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header title="Inbox" className={classes.header} />
      <ChatList onPress={handlePress} />
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  tabView: 'bg-white',
};
