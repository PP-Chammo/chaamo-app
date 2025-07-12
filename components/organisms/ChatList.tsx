import React, { memo } from 'react';

import { FlatList } from 'react-native';

import { ChatListItem } from '@/components/molecules';
import { dummyChatList } from '@/constants/dummy';

interface ChatListProps {
  onPress: (id: number, name: string) => void;
}

const ChatList: React.FC<ChatListProps> = memo(function ChatList({ onPress }) {
  return (
    <FlatList
      testID="chat-list"
      data={dummyChatList}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName="gap-1"
      renderItem={({ item }) => (
        <ChatListItem
          name={item.name}
          message={item.message}
          time={item.time}
          unreadCount={item.unreadCount}
          imageUrl={item.imageUrl}
          onPress={() => onPress(item.id, item.name)}
        />
      )}
    />
  );
});

export default ChatList;
