import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface BillingInfoProps {
  name: string;
  subscriptionInfo: string;
  className?: string;
  isPending?: boolean;
}

const BillingInfo: React.FC<BillingInfoProps> = memo(function BillingInfo({
  name,
  subscriptionInfo,
  isPending,
  className,
}) {
  return (
    <View className={clsx(classes.container, className)}>
      <Text className={classes.label}>Billing Info</Text>
      <View className={classes.card}>
        <View className={classes.row}>
          <View className={classes.row}>
            <Text className={classes.title}>{name}</Text>
            {isPending && <Text className={classes.pendingText}>Pending</Text>}
          </View>
          <Text className={classes.price}>{subscriptionInfo}</Text>
        </View>
      </View>
    </View>
  );
});

const classes = {
  container: 'gap-3',
  price: 'text-sm font-bold',
  label: 'text-sm font-bold text-gray-800',
  card: 'border-[0.2px] border-yellow-500 p-3 rounded-lg',
  row: 'flex-row justify-between gap-4',
  title: 'text-sm text-slate-600',
  pendingText: 'px-2 py-1 rounded-full bg-yellow-50 text-xs text-yellow-600',
};

export default BillingInfo;
