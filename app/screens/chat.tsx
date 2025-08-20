import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  Icon,
  Label,
  Loading,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextField, ChatMessage } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import {
  OrderByDirection,
  useCreateMessagesMutation,
  useGetMessagesLazyQuery,
  useUpdateConversationParticipantsMutation,
  OfferStatus,
  useUpdateOffersMutation,
  useUpdateBidsMutation,
  useGetVwMyConversationsQuery,
  BidStatus,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ChatScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const keyboardHeight = useSharedValue(0);
  const [message, setMessage] = useState('');
  const [actioningOfferId, setActioningOfferId] = useState<string | null>(null);
  const [actioningBidId, setActioningBidId] = useState<string | null>(null);

  const { data: myConversationsData } = useGetVwMyConversationsQuery({
    variables: {
      filter: {
        partner_id: { eq: userId as string },
      },
      last: 1,
      orderBy: [{ created_at: OrderByDirection.DESCNULLSLAST }],
    },
    fetchPolicy: 'cache-and-network',
    skip: !userId,
  });
  const [updateReadMessage] = useUpdateConversationParticipantsMutation();
  const [getMessages, { data: messagesData, loading }] =
    useGetMessagesLazyQuery({
      fetchPolicy: 'cache-and-network',
    });
  const [createMessages, { loading: sendMessageLoading }] =
    useCreateMessagesMutation();
  const [updateOffers, { loading: updateOffersLoading }] =
    useUpdateOffersMutation();
  const [updateBids, { loading: updateBidsLoading }] = useUpdateBidsMutation();

  const conversation = useMemo(() => {
    const edges = myConversationsData?.vw_myconversationsCollection?.edges;
    return edges && edges.length > 0 ? edges[0]?.node : undefined;
  }, [myConversationsData?.vw_myconversationsCollection?.edges]);
  const messages = useMemo(
    () => messagesData?.messagesCollection?.edges ?? [],
    [messagesData],
  );

  // removed: latest/effective listing tracking - inline per message instead

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

  // removed: route/effective listing id and handler - replaced by per-message navigation

  const handleBack = useCallback(() => {
    updateReadMessage({
      variables: {
        filter: {
          conversation_id: { eq: conversation?.id },
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
  }, [updateReadMessage, conversation?.id, user?.id]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim().length > 0) {
      await createMessages({
        variables: {
          objects: [
            {
              conversation_id: conversation?.id,
              content: message,
              sender_id: user?.id,
            },
          ],
        },
      });
      setMessage('');
    }
  }, [conversation?.id, createMessages, message, user?.id]);

  const handleAcceptOffer = useCallback(
    async (offerId: string) => {
      if (!offerId) return;
      setActioningOfferId(offerId);
      try {
        await updateOffers({
          variables: {
            filter: { id: { eq: offerId } },
            set: { status: OfferStatus.ACCEPTED },
            atMost: 1,
          },
        });
      } catch (e) {
        console.error('Failed to accept offer', e);
      } finally {
        setActioningOfferId(null);
      }
    },
    [updateOffers],
  );

  const handleDeclineOffer = useCallback(
    async (offerId: string) => {
      if (!offerId) return;
      setActioningOfferId(offerId);
      try {
        await updateOffers({
          variables: {
            filter: { id: { eq: offerId } },
            set: { status: OfferStatus.DECLINED },
            atMost: 1,
          },
        });
      } catch (e) {
        console.error('Failed to decline offer', e);
      } finally {
        setActioningOfferId(null);
      }
    },
    [updateOffers],
  );

  const handleAcceptBid = useCallback(
    async (bidId: string) => {
      if (!bidId) return;
      setActioningBidId(bidId);
      try {
        await updateBids({
          variables: {
            filter: { id: { eq: bidId } },
            set: { status: BidStatus.ACCEPTED },
            atMost: 1,
          },
        });
      } catch (e) {
        console.error('Failed to accept bid', e);
      } finally {
        setActioningBidId(null);
      }
    },
    [updateBids],
  );

  const handleDeclineBid = useCallback(
    async (bidId: string) => {
      if (!bidId || !conversation?.id || !user?.id) return;
      setActioningBidId(bidId);
      try {
        await updateBids({
          variables: {
            filter: { id: { eq: bidId } },
            set: { status: BidStatus.DECLINED },
            atMost: 1,
          },
        });
      } catch (e) {
        console.error('Failed to decline bid', e);
      } finally {
        setActioningBidId(null);
      }
    },
    [conversation?.id, user?.id, updateBids],
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const conversationId = conversation?.id as string | undefined;
          if (conversationId) {
            const { data: messages } = await getMessages({
              variables: {
                filter: {
                  conversation_id: { eq: conversationId },
                  deleted: { eq: false },
                },
                orderBy: {
                  created_at: OrderByDirection.ASCNULLSFIRST,
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
        } catch (e: unknown) {
          console.error('error fetching conversation/messages', e);
        }
      })();
    }, [getMessages, updateReadMessage, user?.id, conversation?.id]),
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
      {/* MessageListingDetail is now shown inline for specific messages */}
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
              // MessageListingDetail now handled inside ChatMessage

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
                        type={item.node?.type}
                        bidId={item.node?.bid_id}
                        bidAmount={item.node?.bids?.bid_amount}
                        bidCurrency={item.node?.bids?.bid_currency}
                        bidStatus={item.node?.bids?.status}
                        offerId={item.node?.offer_id}
                        offerAmount={item.node?.offers?.offer_amount}
                        offerCurrency={item.node?.offers?.offer_currency}
                        offerStatus={item.node?.offers?.status}
                        partnerUsername={conversation?.username ?? ''}
                        listingId={item.node?.listing_id as string}
                        sellerId={item.node?.listings?.seller_id}
                        onListingDetailPress={(id) =>
                          router.push({
                            pathname: '/screens/listing-detail',
                            params: { id },
                          })
                        }
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
                        type={item.node?.type}
                        bidId={item.node?.bid_id}
                        bidAmount={item.node?.bids?.bid_amount}
                        bidCurrency={item.node?.bids?.bid_currency}
                        bidStatus={item.node?.bids?.status}
                        offerId={item.node?.offer_id}
                        offerAmount={item.node?.offers?.offer_amount}
                        offerCurrency={item.node?.offers?.offer_currency}
                        offerStatus={item.node?.offers?.status}
                        partnerUsername={conversation?.username ?? ''}
                        listingId={item.node?.listing_id as string}
                        sellerId={item.node?.listings?.seller_id}
                        onListingDetailPress={(id) =>
                          router.push({
                            pathname: '/screens/listing-detail',
                            params: { id },
                          })
                        }
                        onAccept={
                          item.node?.bid_id
                            ? () => handleAcceptBid(item.node?.bid_id as string)
                            : item.node?.offer_id
                              ? () =>
                                  handleAcceptOffer(
                                    item.node?.offer_id as string,
                                  )
                              : undefined
                        }
                        onDecline={
                          item.node?.bid_id
                            ? () =>
                                handleDeclineBid(item.node?.bid_id as string)
                            : item.node?.offer_id
                              ? () =>
                                  handleDeclineOffer(
                                    item.node?.offer_id as string,
                                  )
                              : undefined
                        }
                        actionLoading={
                          (!!item.node?.offer_id &&
                            actioningOfferId ===
                              (item.node?.offer_id as string) &&
                            updateOffersLoading) ||
                          (!!item.node?.bid_id &&
                            actioningBidId === (item.node?.bid_id as string) &&
                            updateBidsLoading)
                        }
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
