import React, { useCallback, useMemo, useState } from 'react';

import { Alert, TextInput, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';
import { currencySymbolMap } from '@/constants/currencies';
import { useCreateOffersMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

interface PlaceOfferModalContentProps {
  id: string;
  sellerId: string;
  onDismiss: () => void;
}

const PlaceOfferModalContent: React.FC<PlaceOfferModalContentProps> = ({
  id,
  sellerId,
  onDismiss,
}) => {
  const [user] = useUserVar();

  const [offer, setOffer] = useState('');

  const [createOffers, { loading }] = useCreateOffersMutation();

  const currencySymbol = useMemo(() => {
    return currencySymbolMap[user.profile?.currency ?? 'USD'];
  }, [user.profile?.currency]);

  const handleSubmitOffer = useCallback(() => {
    createOffers({
      variables: {
        objects: [
          {
            listing_id: id,
            buyer_id: user.id,
            seller_id: sellerId,
            offer_currency: user.profile?.currency,
            offer_amount: Number(offer).toFixed(2),
          },
        ],
      },
      onCompleted: () => {
        Alert.alert('Success', 'Your offer has been sent successfully', [
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
  }, [
    createOffers,
    id,
    offer,
    onDismiss,
    sellerId,
    user.id,
    user.profile?.currency,
  ]);

  return (
    <View className={classes.container}>
      <Row between className={classes.headerRow}>
        <Label className={classes.title}>Place your custom offer</Label>
      </Row>
      <Label className={classes.label}>Your Offer</Label>
      <TextInput
        className={classes.input}
        value={`${currencySymbol} ${offer}`}
        onChangeText={(v) => setOffer(v.replace(/\D/g, ''))}
        keyboardType="numeric"
        placeholder="$0"
        placeholderTextColor="#fff"
        selectionColor="#fff"
      />
      <Button
        variant="white-light"
        className={classes.placeOfferBtn}
        onPress={handleSubmitOffer}
        loading={loading}
        disabled={loading || !offer}
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
};

export default PlaceOfferModalContent;
