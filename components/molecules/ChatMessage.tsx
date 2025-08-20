import { memo, useCallback, useMemo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

import Button from '@/components/atoms/Button';
import MessageListingDetail from '@/components/molecules/MessageListingDetail';
import { BidStatus, MessageType, OfferStatus } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';

interface ChatMessageProps {
  message: string;
  position: 'left' | 'right';
  onAccept?: () => void;
  onDecline?: () => void;
  type?: MessageType | null;
  bidId?: string | null;
  bidAmount?: number | string | null;
  bidCurrency?: string | null;
  offerId?: string | null;
  offerAmount?: number | string | null;
  offerCurrency?: string | null;
  actionLoading?: boolean;
  offerStatus?: OfferStatus | null;
  bidStatus?: BidStatus | null;
  listingId?: string | null;
  onListingDetailPress?: (listingId: string) => void;
  partnerUsername?: string | null;
  sellerId?: string | null;
}

const ChatMessage: React.FC<ChatMessageProps> = memo(function ChatMessage({
  message,
  position,
  onAccept,
  onDecline,
  type,
  bidId,
  bidAmount,
  bidCurrency,
  offerId,
  offerAmount,
  offerCurrency,
  actionLoading,
  offerStatus,
  bidStatus,
  listingId,
  onListingDetailPress,
  partnerUsername,
  sellerId,
}) {
  const [user] = useUserVar();
  console.log(user?.id, sellerId, message);
  const { formatDisplay } = useCurrencyDisplay();
  const handleAccept = useCallback(() => {
    onAccept?.();
  }, [onAccept]);
  const handleDecline = useCallback(() => {
    onDecline?.();
  }, [onDecline]);

  const messageTypes = useMemo(
    () => ({
      isBid:
        type === MessageType?.REQUEST_BID ||
        type === MessageType?.CONFIRM_BID ||
        !!bidId,
      isOffer:
        type === MessageType?.REQUEST_OFFER ||
        type === MessageType?.CONFIRM_OFFER ||
        !!offerId,
    }),
    [type, bidId, offerId],
  );

  const titleInfo = useMemo(() => {
    const [titleLine] = (message || '').split('\n');

    const isCurrentUserBuyer =
      (messageTypes.isBid && bidId && user?.id !== sellerId) ||
      (messageTypes.isOffer && offerId && user?.id !== sellerId);

    const buyerName = isCurrentUserBuyer ? 'You' : partnerUsername;
    const actionBase = messageTypes.isBid
      ? 'made a bid'
      : messageTypes.isOffer
        ? 'offered a price'
        : '';
    const composedTitle = actionBase
      ? `${buyerName} ${actionBase}:`
      : titleLine || '';
    return { titleText: composedTitle };
  }, [
    message,
    messageTypes.isBid,
    messageTypes.isOffer,
    bidId,
    offerId,
    user?.id,
    partnerUsername,
    sellerId,
  ]);

  const amountInfo = useMemo(() => {
    const [, amountLine] = (message || '').split('\n');
    const hasBidRef = !!bidId;
    const hasOfferRef = !!offerId;
    const hasRef = hasBidRef || hasOfferRef;
    const rawAmount = hasBidRef ? bidAmount : offerAmount;
    const rawCurrency = (hasBidRef ? bidCurrency : offerCurrency) ?? undefined;

    let amountText = amountLine?.trim() || '';
    if (hasRef && rawAmount != null && rawCurrency) {
      amountText = formatDisplay(rawCurrency, rawAmount);
    }

    return { amountText, hasRef, hasBidRef, hasOfferRef };
  }, [
    message,
    bidId,
    offerId,
    bidAmount,
    offerAmount,
    bidCurrency,
    offerCurrency,
    formatDisplay,
  ]);

  const statusInfo = useMemo(() => {
    const isAccepted =
      (messageTypes.isOffer && offerStatus === OfferStatus?.ACCEPTED) ||
      (messageTypes.isBid && bidStatus === BidStatus?.ACCEPTED);
    const isDeclined =
      (messageTypes.isOffer && offerStatus === OfferStatus?.DECLINED) ||
      (messageTypes.isBid && bidStatus === BidStatus?.DECLINED);

    const statusLabelBase = isAccepted
      ? 'Accepted'
      : isDeclined
        ? 'Declined'
        : null;
    const displayLabel =
      position === 'right'
        ? (statusLabelBase ?? 'Pending')
        : (statusLabelBase ?? null);
    const shouldShowStatusPill =
      (messageTypes.isOffer || messageTypes.isBid) &&
      (position === 'right' || !!statusLabelBase);

    const pillClass = isAccepted
      ? classes.statusAccepted
      : isDeclined
        ? classes.statusDeclined
        : classes.statusPending;
    const textClass = isAccepted
      ? classes.statusTextAccepted
      : isDeclined
        ? classes.statusTextDeclined
        : classes.statusTextPending;

    return {
      isAccepted,
      isDeclined,
      displayLabel,
      shouldShowStatusPill,
      pillClass,
      textClass,
    };
  }, [
    messageTypes.isOffer,
    messageTypes.isBid,
    offerStatus,
    bidStatus,
    position,
  ]);

  const actionInfo = useMemo(() => {
    if (position !== 'left') {
      return {
        isOfferActionable: false,
        isBidActionable: false,
        withActions: false,
      };
    }

    const isPendingOffer =
      offerStatus !== OfferStatus?.ACCEPTED &&
      offerStatus !== OfferStatus?.DECLINED;
    const isPendingBid =
      bidStatus !== BidStatus?.ACCEPTED && bidStatus !== BidStatus?.DECLINED;

    const isOfferActionable =
      amountInfo.hasOfferRef && isPendingOffer && onAccept && onDecline;
    const isBidActionable =
      amountInfo.hasBidRef && isPendingBid && onAccept && onDecline;
    const withActions = isOfferActionable || isBidActionable;

    return { isOfferActionable, isBidActionable, withActions };
  }, [
    position,
    amountInfo.hasOfferRef,
    amountInfo.hasBidRef,
    offerStatus,
    bidStatus,
    onAccept,
    onDecline,
  ]);

  const hasListingDetail =
    (messageTypes.isOffer || messageTypes.isBid) && !!listingId;

  if (messageTypes.isBid || messageTypes.isOffer) {
    return (
      <View
        className={clsx(
          classes.container,
          classes.specialCard,
          classes.position[position],
        )}
        testID="chat-message-container"
      >
        {hasListingDetail && (
          <MessageListingDetail
            listingId={listingId as string}
            onDetailPress={
              onListingDetailPress && listingId
                ? () => onListingDetailPress(listingId as string)
                : undefined
            }
          />
        )}
        {!!titleInfo.titleText && (
          <Text className={classes.specialTitle}>{titleInfo.titleText}</Text>
        )}
        {!!amountInfo.amountText && (
          <View
            className={clsx(
              classes.amountRow,
              actionInfo.withActions
                ? classes.amountRowWithActions
                : classes.amountRowTight,
            )}
          >
            <Text className={classes.specialAmount}>
              {amountInfo.amountText}
            </Text>
            {statusInfo.shouldShowStatusPill && statusInfo.displayLabel && (
              <View className={clsx(classes.statusPill, statusInfo.pillClass)}>
                <Text
                  className={clsx(classes.statusText, statusInfo.textClass)}
                >
                  {statusInfo.displayLabel}
                </Text>
              </View>
            )}
          </View>
        )}
        {actionInfo.withActions && (
          <View className={classes.actionsRow}>
            <Button
              variant="light"
              size="small"
              className={classes.actionBtn}
              disabled={!!actionLoading}
              onPress={handleDecline}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="small"
              className={classes.actionBtn}
              disabled={!!actionLoading}
              onPress={handleAccept}
            >
              Accept
            </Button>
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className={clsx(classes.container, classes.position[position])}
      testID="chat-message-container"
    >
      <Text className={classes.message} testID="chat-message-text">
        {message}
      </Text>
    </View>
  );
});

const classes = {
  container:
    'flex-0 max-w-[80%] bg-primary-50 px-4 py-3 border border-slate-100 rounded-lg',
  message: 'text-slate-600',
  position: {
    left: 'self-start',
    right: 'self-end',
  },
  specialCard: 'bg-primary-50 w-full',
  specialTitle: 'text-slate-600 mb-1',
  specialAmount: 'text-2xl font-bold text-slate-700',
  amountRow: 'flex-row items-center justify-between gap-3',
  amountRowWithActions: 'mb-3',
  amountRowTight: 'mb-0',
  actionsRow: 'flex-row gap-3 mt-1',
  actionBtn: 'flex-[0.5]',
  statusPill: 'px-2 py-1 rounded-full border',
  statusAccepted: 'border-primary-300 bg-primary-50',
  statusDeclined: 'border-rose-200 bg-rose-50',
  statusPending: 'border-amber-200 bg-amber-50',
  statusText: 'text-xs font-semibold',
  statusTextAccepted: 'text-primary-500',
  statusTextDeclined: 'text-rose-700',
  statusTextPending: 'text-amber-700',
};

export default ChatMessage;
