import React, { useState } from 'react';

import { TextInput, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';

const PlaceOfferModalContent: React.FC = () => {
  const [offer, setOffer] = useState('5000');

  return (
    <View className={classes.container}>
      <Row between className={classes.headerRow}>
        <Label className={classes.title}>Place your custom offer</Label>
      </Row>
      <Label className={classes.label}>Your Offer</Label>
      <TextInput
        className={classes.input}
        value={`$${offer}`}
        onChangeText={(v) => setOffer(v.replace(/\D/g, ''))}
        keyboardType="numeric"
        placeholder="$0"
        placeholderTextColor="#fff"
        selectionColor="#fff"
      />
      <Button
        variant="white-light"
        size="small"
        className={classes.placeOfferBtn}
        textClassName={classes.placeOfferBtnText}
      >
        Send Offer
      </Button>
    </View>
  );
};

const classes = {
  container: 'flex-1 bg-primary-500 rounded-t-3xl p-4.5',
  headerRow: 'mb-3',
  title: 'text-white text-lg font-bold',
  label: 'text-white text-base font-semibold mb-1',
  input: 'text-white text-3xl font-bold border-b border-white/70 mb-2 pb-1',
  placeOfferBtn: 'mt-4.5',
  placeOfferBtnText: 'text-white text-lg font-bold',
};

export default PlaceOfferModalContent;
