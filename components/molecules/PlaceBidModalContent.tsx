import React, { useState } from 'react';

import { TextInput, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';

const quickBids = [5000, 6000, 7000];

const PlaceBidModalContent: React.FC = () => {
  const [bid, setBid] = useState('5000');
  const [selected, setSelected] = useState(0);

  const handleQuickBid = (value: number, idx: number) => {
    setBid(value.toString());
    setSelected(idx);
  };

  return (
    <View className={classes.container}>
      <Row between className={classes.headerRow}>
        <Label className={classes.title}>Place Bid</Label>
        <Label className={classes.time}>7d 15h</Label>
      </Row>
      <View className={classes.maxBidRow}>
        <Label className={classes.label}>Max Bid</Label>
        <TextInput
          className={classes.input}
          value={`$${bid}`}
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
        size="small"
        className={classes.placeBidBtn}
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
