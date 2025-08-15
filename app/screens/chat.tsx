import { useCallback, useMemo, useRef, useState } from 'react';

import { format } from 'date-fns';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlatList, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';

import {
  Avatar,
  ChatMessage,
  Icon,
  Label,
  Loading,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextField } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  OrderByDirection,
  useCreateConversationsMutation,
  useCreateConversationParticipantsMutation,
  useCreateMessagesMutation,
  useGetMessagesLazyQuery,
  useGetConversationParticipantsLazyQuery,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ChatScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [message, setMessage] = useState('');

  const [getConversationParticipants, { data: cpData }] =
    useGetConversationParticipantsLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [getMessages, { data: messagesData, loading }] =
    useGetMessagesLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [createConversations] = useCreateConversationsMutation();
  const [createConversationParticipants] =
    useCreateConversationParticipantsMutation();
  const [createMessages, { loading: sendMessageLoading }] =
    useCreateMessagesMutation();

  const conversationParticipant = useMemo(
    () => cpData?.conversation_participantsCollection?.edges?.[0]?.node,
    [cpData],
  );
  const messages = useMemo(
    () => messagesData?.messagesCollection?.edges ?? [],
    [messagesData],
  );

  const handleChangeMessage = ({ value }: TextChangeParams) => {
    setMessage(value);
  };

  const handleSendMessage = useCallback(async () => {
    if (message.trim().length > 0) {
      await createMessages({
        variables: {
          objects: [
            {
              conversation_id: conversationParticipant?.conversation_id,
              content: message,
              sender_id: user?.id,
            },
          ],
        },
      });
      setMessage('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [
    conversationParticipant?.conversation_id,
    createMessages,
    flatListRef,
    message,
    user?.id,
  ]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (userId) {
            const { data: cpData } = await getConversationParticipants({
              variables: {
                filter: {
                  user_id: { eq: userId },
                },
              },
            });
            const conversationId =
              cpData?.conversation_participantsCollection?.edges?.[0]?.node
                ?.conversation_id;
            if (conversationId) {
              await getMessages({
                variables: {
                  filter: {
                    conversation_id: {
                      eq: conversationId,
                    },
                    deleted: { eq: false },
                  },
                  orderBy: { created_at: OrderByDirection.ASCNULLSLAST },
                },
              });
            } else {
              const { data: insertedConversationData } =
                await createConversations({
                  variables: {
                    objects: [
                      {
                        metadata: '{}',
                      },
                    ],
                  },
                });
              const insertedConversationId =
                insertedConversationData?.insertIntoconversationsCollection
                  ?.records?.[0]?.id;
              if (insertedConversationId) {
                await createConversationParticipants({
                  variables: {
                    objects: [
                      {
                        conversation_id: insertedConversationId,
                        user_id: user?.id,
                      },
                      {
                        conversation_id: insertedConversationId,
                        user_id: userId,
                      },
                    ],
                  },
                });
                getConversationParticipants({
                  variables: {
                    filter: {
                      user_id: { eq: userId },
                    },
                  },
                });
                getMessages({
                  variables: {
                    filter: {
                      conversation_id: {
                        eq: insertedConversationId,
                      },
                      deleted: { eq: false },
                    },
                    orderBy: { created_at: OrderByDirection.ASCNULLSLAST },
                  },
                });
              }
            }
          }
        } catch (e: unknown) {
          console.error('chat init error', e);
        }
      })();
    }, [
      createConversationParticipants,
      createConversations,
      getConversationParticipants,
      getMessages,
      user?.id,
      userId,
    ]),
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        leftComponent={
          <View className={classes.leftComponent}>
            <Avatar
              size="sm"
              imageUrl={
                conversationParticipant?.profiles?.profile_image_url as string
              }
            />
            <Label className={classes.name}>
              {conversationParticipant?.profiles?.username}
            </Label>
          </View>
        }
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.node?.id}
            className={classes.flatList}
            contentContainerClassName={classes.contentContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            renderItem={({ item, index }) => {
              const isSelf = item.node?.sender_id === user?.id;
              const isSameUser =
                item.node?.sender_id === messages[index - 1]?.node?.sender_id;
              const isDifferentDate =
                index === 0 ||
                (index > 0 &&
                  format(new Date(item.node?.created_at), 'yyyy-MM-dd') !==
                    format(
                      new Date(messages[index - 1]?.node?.created_at),
                      'yyyy-MM-dd',
                    ));

              return (
                <View>
                  {isDifferentDate && (
                    <Label variant="subtitle" className={classes.dateText}>
                      {format(new Date(item.node?.created_at), 'd MMM yyyy')}
                    </Label>
                  )}
                  {isSelf ? (
                    <View>
                      <ChatMessage
                        key={item.node?.id}
                        message={item.node?.content}
                        position="right"
                      />
                    </View>
                  ) : (
                    <Row>
                      {!isSameUser ? (
                        <Avatar
                          size="xs"
                          imageUrl={
                            conversationParticipant?.profiles
                              ?.profile_image_url as string
                          }
                        />
                      ) : (
                        <View className={classes.spacer} />
                      )}
                      <ChatMessage
                        key={item.node?.id}
                        message={item.node?.content}
                        position="left"
                      />
                    </Row>
                  )}
                </View>
              );
            }}
          />
        )}

        <KeyboardStickyView
          offset={{ closed: 0, opened: 240 }}
          className={classes.keyboardStickyView}
        >
          <View className={classes.bottomContainer}>
            <Icon
              variant="FontAwesome6"
              name="add"
              size={24}
              color={getColor('slate-500')}
            />
            <View className={classes.messageInputContainer}>
              <TextField
                className={classes.messageInput}
                name="message"
                onChange={handleChangeMessage}
                value={message}
                placeholder="Type a message..."
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSendMessage}
              disabled={sendMessageLoading || message.trim().length === 0}
              className={classes.sendButton}
            >
              <Icon name="send" size={26} color={getColor('white')} />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const classes = {
  leftComponent: 'flex-row items-center gap-2',
  name: 'text-lg font-medium',
  messageContainerMe: 'self-end mb-2',
  messageContainerOther: 'mb-2',
  messageOtherContent: 'flex-row items-start gap-2',
  messagesGroup: 'gap-1',
  contentContainer: 'mx-6 gap-2',
  bottomContainer: 'flex-row gap-4 items-center px-4 py-6 bg-white',
  messageInput: 'bg-primary-50 border border-slate-200 rounded-xl',
  dateText: 'text-sm text-center text-slate-500 my-5',
  flatList: 'bg-white/50',
  messageInputContainer: 'flex-1',
  header: 'bg-white',
  containerTop: 'bg-white',
  keyboardAvoidingView: 'bg-white',
  keyboardStickyView: 'bg-white border-t border-slate-200',
  spacer: 'w-10 h-1',
  sendButton:
    'h-12 w-12 bg-primary-500 !rounded-full items-center justify-center disabled:opacity-50',
};
