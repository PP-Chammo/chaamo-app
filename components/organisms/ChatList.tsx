import { memo } from 'react';

import { FlatList } from 'react-native';

import { ChatListItem } from '@/components/molecules';
import { dummyChatList } from '@/constants/dummy';

interface ChatListProps {
  onPress: (id: number, name: string) => void;
}

const ChatList = memo(function ChatList({ onPress }: ChatListProps) {
  return (
    <FlatList
      data={dummyChatList}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName="gap-1"
      renderItem={({ item }) => (
        <ChatListItem
          name={item.name}
          message={item.message}
          time={new Date(item.time)}
          unreadCount={item.unreadCount}
          imageUrl={item.imageUrl}
          onPress={() => onPress(item.id, item.name)}
        />
      )}
    />
  );
});

export default ChatList;
