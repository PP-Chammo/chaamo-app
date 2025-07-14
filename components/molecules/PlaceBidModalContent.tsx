import React, { useState } from 'react';

import { View, TextInput, Pressable } from 'react-native';

import { Label, Button } from '@/components/atoms';

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
      <View className={classes.headerRow}>
        <Label className={classes.title}>Place Bid</Label>
        <Label className={classes.time}>7d 15h</Label>
      </View>
      <Label className={classes.label}>Max Bid</Label>
      <TextInput
        className={classes.input}
        value={`$${bid}`}
        onChangeText={(v) => setBid(v.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        placeholder="$0"
        placeholderTextColor="#fff"
        selectionColor="#fff"
      />
      <Label className={classes.currentBid}>Current Bid: $4000</Label>
      <View className={classes.quickBidRow}>
        {quickBids.map((val, idx) => (
          <Pressable
            key={val}
            className={
              selected === idx ? classes.quickBidActive : classes.quickBid
            }
            onPress={() => handleQuickBid(val, idx)}
          >
            <Label
              className={
                selected === idx
                  ? classes.quickBidTextActive
                  : classes.quickBidText
              }
            >
              ${val}
            </Label>
          </Pressable>
        ))}
      </View>
      <Label className={classes.note}>
        <Label className={classes.noteBold}>Note:</Label> The minimum threshold
        for placing a bid is set at $2000. Please ensure your bid meets or
        exceeds this amount.
      </Label>
      <Button
        variant="light"
        size="small"
        className={classes.placeBidBtn}
        textClassName={classes.placeBidBtnText}
      >
        Place Bid
      </Button>
    </View>
  );
};

const classes = {
  container: 'flex-1 bg-teal-600 rounded-t-3xl px-6 pt-2 pb-6',
  headerRow: 'flex-row justify-between items-center mb-6',
  title: 'text-white text-2xl font-bold',
  time: 'text-white text-lg font-bold',
  label: 'text-white text-base font-semibold mb-1',
  input: 'text-white text-3xl font-bold border-b border-white mb-2 pb-1',
  currentBid: 'text-white text-base mb-4',
  quickBidRow: 'flex-row justify-between mb-6',
  quickBid: 'flex-1 border border-white rounded-full py-2 mx-1 items-center',
  quickBidActive:
    'flex-1 bg-white border border-white rounded-full py-2 mx-1 items-center',
  quickBidText: 'text-white text-lg font-bold',
  quickBidTextActive: 'text-teal-500 text-lg font-bold',
  note: 'text-white text-base mb-6',
  noteBold: 'font-bold',
  placeBidBtn: 'border-2 border-white rounded-full py-3 mt-2',
  placeBidBtnText: 'text-white text-lg font-bold',
};

export default PlaceBidModalContent;
