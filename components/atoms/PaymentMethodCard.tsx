import React, { memo } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Text, View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface PaymentMethodCardProps {
  nextBilling?: boolean;
  className?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = memo(
  function Label({ nextBilling, className }) {
    return (
      <View className={clsx(classes.container, className)}>
        <Text className={classes.label}>Charged from</Text>
        <View className={classes.card}>
          <View className={classes.row}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={24}
              color={getColor('slate-500')}
            />
            <View>
              <Text>**** **** **** 2424</Text>
              <Text className={classes.expiry}>Expiry 02/26</Text>
              {nextBilling && (
                <Text className={classes.nextBilling}>
                  Next billing date 10/12/2025
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const classes = {
  card: 'border-[0.2px] border-primary-500 p-2 rounded-lg',
  label: 'text-sm font-bold text-gray-800',
  row: 'flex-row items-center gap-4',
  expiry: 'text-sm text-gray-500',
  nextBilling: 'text-sm text-green-600 mt-4',
  container: 'gap-3',
};

export default PaymentMethodCard;
