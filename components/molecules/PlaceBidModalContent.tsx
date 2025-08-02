import React, { useCallback, useMemo, useState } from 'react';

import { Alert, TextInput, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';
import { currencySymbolMap } from '@/constants/currencies';
import { useCreateBidsMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { formatElapsedTime } from '@/utils/date';

const quickBids = [100, 200, 300];

interface PlaceBidModalContentProps {
  id: string;
  endDate: string;
  onDismiss: () => void;
}

const PlaceBidModalContent: React.FC<PlaceBidModalContentProps> = ({
  id,
  endDate,
  onDismiss,
}) => {
  const [user] = useUserVar();

  const [bid, setBid] = useState('5000');
  const [selected, setSelected] = useState(0);

  const [createBids, { loading }] = useCreateBidsMutation();

  const currencySymbol = useMemo(() => {
    return currencySymbolMap[user.profile?.currency ?? 'USD'];
  }, [user.profile?.currency]);

  const handleQuickBid = (value: number, idx: number) => {
    setBid(value.toString());
    setSelected(idx);
  };

  const handleSubmitBid = useCallback(() => {
    createBids({
      variables: {
        objects: [
          {
            listing_id: id,
            user_id: user.id,
            bid_amount: Number(bid).toFixed(2),
          },
        ],
      },
      onCompleted: () => {
        Alert.alert('Success', 'Your bid has been placed successfully', [
          {
            text: 'OK',
            onPress: onDismiss,
          },
        ]);
        onDismiss();
      },
      onError: (e) => {
        Alert.alert('Failed', e.message, [
          {
            text: 'OK',
            onPress: onDismiss,
          },
        ]);
      },
    });
  }, [bid, createBids, id, onDismiss, user.id]);

  return (
    <View className={classes.container}>
      <Row between className={classes.headerRow}>
        <Label className={classes.title}>Place Bid</Label>
        <Label className={classes.time}>{formatElapsedTime(endDate)}</Label>
      </Row>
      <View className={classes.maxBidRow}>
        <Label className={classes.label}>Max Bid</Label>
        <TextInput
          className={classes.input}
          value={`${currencySymbol} ${bid}`}
          onChangeText={(v) => setBid(v.replace(/\D/g, ''))}
          keyboardType="numeric"
          placeholder="$0"
          placeholderTextColor="#fff"
          selectionColor="#fff"
        />
        <Label className={classes.currentBid}>Current Bid: $4000</Label>
      </View>
      <Row className={classes.quickBidRow}>
        {quickBids.map((val, idx) => (
          <Button
            key={val}
            variant={selected === idx ? 'white' : 'white-light'}
            size="small"
            className={classes.quickBid}
            onPress={() => handleQuickBid(val, idx)}
          >
            ${val}
          </Button>
        ))}
      </Row>
      <Label className={classes.note}>
        <Label className={classes.noteBold}>Note:</Label> The minimum threshold
        for placing a bid is set at $2000. Please ensure your bid meets or
        exceeds this amount.
      </Label>
      <Button
        variant="white-light"
        className={classes.placeBidBtn}
        onPress={handleSubmitBid}
        loading={loading}
        disabled={loading || !bid}
      >
        Place Bid
      </Button>
    </View>
  );
};

const classes = {
  container: 'flex-1 gap-4.5 bg-primary-500 rounded-t-3xl p-4.5',
  headerRow: 'mb-2',
  title: 'text-white font-bold',
  time: 'text-white font-semibold',
  maxBidRow: 'gap-0.5',
  label: 'text-white text-base font-semibold mb-2',
  input: 'text-white text-3xl font-bold border-b border-white mb-2 pb-1',
  currentBid: 'text-white text-sm',
  quickBidRow: 'gap-5',
  quickBid: 'flex-1',
  note: 'text-white',
  noteBold: 'text-white font-bold',
  placeBidBtn: 'mt-2',
};

export default PlaceBidModalContent;
