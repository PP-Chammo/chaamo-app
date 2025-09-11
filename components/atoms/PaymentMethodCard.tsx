import React, { memo } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { Text, View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface PaymentMethodCardProps {
  name: string;
  subscriptionInfo: {
    last4: string;
    expiry: string;
  };
  nextBillingDate?: string;
  className?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = memo(
  function Label({ name, subscriptionInfo, nextBillingDate, className }) {
    return (
      <View className={clsx(classes.container, className)}>
        <Text className={classes.label}>Charged from</Text>
        <View className={classes.card}>
          <View className={classes.row}>
            <MaterialIcons
              name={name.toLowerCase() === 'paypal' ? 'paypal' : 'credit-card'}
              size={24}
              color={getColor('slate-500')}
            />
            <View>
              <Text>**** **** **** {subscriptionInfo.last4}</Text>
              <Text className={classes.expiry}>
                Expiry {subscriptionInfo.expiry}
              </Text>
              {nextBillingDate && (
                <Text className={classes.nextBilling}>
                  Next billing date{' '}
                  {format(new Date(nextBillingDate), 'dd/MM/yyyy')}
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
