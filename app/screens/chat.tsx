import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { format } from 'date-fns';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlatList, Platform, TouchableOpacity, View } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

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
  useCreateMessagesMutation,
  useFnGetOrCreateConversationMutation,
  useGetMessagesLazyQuery,
  useUpdateConversationParticipantsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ChatScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const keyboardHeight = useSharedValue(0);
  const [message, setMessage] = useState('');

  const [getOrCreateConversation, { data: conversationData }] =
    useFnGetOrCreateConversationMutation();
  const [updateReadMessage] = useUpdateConversationParticipantsMutation();
  const [getMessages, { data: messagesData, loading }] =
    useGetMessagesLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [createMessages, { loading: sendMessageLoading }] =
    useCreateMessagesMutation();

  const conversation = useMemo(
    () => conversationData?.fn_get_or_create_conversation,
    [conversationData?.fn_get_or_create_conversation],
  );
  const messages = useMemo(
    () => messagesData?.messagesCollection?.edges ?? [],
    [messagesData],
  );

  const handleChangeMessage = ({ value }: TextChangeParams) => {
    setMessage(value);
  };

  const scrollToBottom = useCallback((animated = true) => {
    if (flatListRef.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated });
      });
    }
  }, []);

  useKeyboardHandler(
    {
      onStart: (event) => {
        'worklet';
        keyboardHeight.value = Math.max(event.height, 0);
        runOnJS(scrollToBottom)(false);
      },
      onMove: (event) => {
        'worklet';
        keyboardHeight.value = Math.max(event.height, 0);
      },
      onEnd: (event) => {
        'worklet';
        keyboardHeight.value = Math.max(event.height, 0);
        runOnJS(scrollToBottom)(false);
      },
    },
    [scrollToBottom],
  );

  const keyboardAnimatedStyle = useAnimatedStyle(() => {
    const reduction = Platform.OS === 'android' ? 50 : 34;
    return {
      height: Math.max(keyboardHeight.value - reduction, 0),
    };
  }, []);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, messages, scrollToBottom]);

  useEffect(() => {
    if (!sendMessageLoading && messages.length > 0) {
      scrollToBottom(false);
    }
  }, [sendMessageLoading, messages, scrollToBottom]);

  const handleBack = useCallback(() => {
    updateReadMessage({
      variables: {
        filter: {
          conversation_id: { eq: conversation?.conversation_id },
          user_id: { eq: user?.id },
        },
        set: {
          unread_count: 0,
          last_read_message_id: null,
        },
      },
      onCompleted: () => {
        router.back();
      },
    });
  }, [updateReadMessage, conversation?.conversation_id, user?.id]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim().length > 0) {
      await createMessages({
        variables: {
          objects: [
            {
              conversation_id: conversation?.conversation_id,
              content: message,
              sender_id: user?.id,
            },
          ],
        },
      });
      setMessage('');
    }
  }, [conversation?.conversation_id, createMessages, message, user?.id]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (userId) {
            const { data: conversationData } = await getOrCreateConversation({
              variables: {
                partner_id: userId,
              },
            });
            const conversationId =
              conversationData?.fn_get_or_create_conversation?.conversation_id;
            if (conversationId) {
              const { data: messages } = await getMessages({
                variables: {
                  filter: {
                    conversation_id: { eq: conversationId },
                    deleted: { eq: false },
                  },
                },
              });
              const lastMessageId =
                messages?.messagesCollection?.edges?.[
                  messages?.messagesCollection?.edges?.length - 1
                ]?.node?.id;
              if (lastMessageId) {
                updateReadMessage({
                  variables: {
                    filter: {
                      conversation_id: { eq: conversationId },
                      user_id: { eq: user?.id },
                    },
                    set: {
                      unread_count: 0,
                      last_read_message_id: lastMessageId,
                    },
                  },
                });
              }
            }
          }
        } catch (e: unknown) {
          console.error('error create conversation participants', e);
        }
      })();
    }, [
      getMessages,
      getOrCreateConversation,
      updateReadMessage,
      user?.id,
      userId,
    ]),
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        leftComponent={
          <View className={classes.leftComponent}>
            <Avatar size="sm" imageUrl={conversation?.profile_image_url} />
            <Label className={classes.name}>{conversation?.username}</Label>
          </View>
        }
        onBackPress={handleBack}
        className={classes.header}
      />
      <View style={{ flex: 1 }}>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.node?.id}
            className={classes.flatList}
            contentContainerClassName={classes.contentContainer}
            ListFooterComponent={<View className={classes.footer} />}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onContentSizeChange={() => scrollToBottom(false)}
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
                          imageUrl={conversation?.profile_image_url}
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

        <View className={classes.keyboardStickyView}>
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
        </View>
        <Animated.View style={keyboardAnimatedStyle} />
      </View>
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
  keyboardStickyView: 'bg-white border-t border-slate-200 pb-0',
  spacer: 'w-10 h-1',
  sendButton:
    'h-12 w-12 bg-primary-500 !rounded-full items-center justify-center disabled:opacity-50',
  footer: 'h-4',
};
