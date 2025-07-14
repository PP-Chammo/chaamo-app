import React, { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { getColor } from '@/utils/getColor';

const PaymentMethodCard = memo(function Label() {
  return (
    <View className={classes.container}>
      <View className={classes.row}>
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color={getColor('slate-500')}
        />
        <View>
          <Text>**** **** **** 2424</Text>
          <Text className={classes.expiry}>Expiry 02/26</Text>
        </View>
      </View>
    </View>
  );
});

const classes = {
  container: 'border-[0.2px] border-green-500 p-2',
  row: 'flex-row items-center gap-4',
  expiry: 'text-sm text-gray-500',
};

export default PaymentMethodCard;
