import React, { memo, useCallback, useMemo } from 'react';

import { useFocusEffect } from 'expo-router';
import { Alert, FlatList } from 'react-native';

import { ChatListItem } from '@/components/molecules';
import {
  OrderByDirection,
  useGetVwMyConversationsLazyQuery,
  useUpdateMessagesMutation,
} from '@/generated/graphql';

interface ChatListProps {
  onPress: (userId: string) => void;
}

const ChatList: React.FC<ChatListProps> = memo(function ChatList({ onPress }) {
  const [getVwMyConversations, { data, refetch }] =
    useGetVwMyConversationsLazyQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        orderBy: { created_at: OrderByDirection.DESCNULLSLAST },
      },
    });
  const [updateMessages] = useUpdateMessagesMutation();

  const conversations = useMemo(
    () => data?.vw_myconversationsCollection?.edges ?? [],
    [data],
  );

  const handleDelete = useCallback(
    (conversationId: string, username: string) => () => {
      Alert.alert(
        'Delete',
        `Are you sure you want to delete chat with ${username}?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await updateMessages({
                variables: {
                  filter: {
                    conversation_id: { eq: conversationId },
                  },
                  set: {
                    deleted: true,
                  },
                },
              });
              refetch();
            },
          },
        ],
      );
    },
    [updateMessages, refetch],
  );

  useFocusEffect(
    useCallback(() => {
      getVwMyConversations();
    }, [getVwMyConversations]),
  );

  return (
    <FlatList
      testID="chat-list"
      data={conversations}
      keyExtractor={(item) => item.node?.id.toString()}
      contentContainerClassName="gap-1"
      renderItem={({ item }) => (
        <ChatListItem
          name={item.node?.username ?? ''}
          message={item.node?.content ?? ''}
          time={item.node?.created_at ?? new Date().toISOString()}
          unreadCount={item.node?.unread_count ?? 0}
          imageUrl={item.node?.profile_image_url ?? ''}
          onPress={() => onPress(item.node?.partner_id ?? '')}
          onLongPress={handleDelete(
            item.node?.id ?? '',
            item.node?.username ?? '',
          )}
        />
      )}
    />
  );
});

export default ChatList;
