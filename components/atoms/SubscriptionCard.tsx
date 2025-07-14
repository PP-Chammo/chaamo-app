import { memo } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { getColor } from '@/utils/getColor';

const SubscriptionCard = memo(function SubscriptionCard() {
  return (
    <TouchableOpacity className={classes.container}>
      <View className={classes.rowBetween}>
        <View className={classes.row}>
          <Image
            source={require('@/assets/images/logo.png')}
            className={classes.logo}
          />
          <View>
            <Text className={classes.title}>Gold Subscription</Text>
            <Text className={classes.price}>$12.88/monthly</Text>
            <Text className={classes.nextBilling}>
              Next billing date 10/12/2025
            </Text>
          </View>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={34}
          color={getColor('slate-600')}
        />
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  container: 'border-[0.2px] border-green-500 rounded-lg p-4',
  row: 'flex-row items-center gap-6',
  logo: 'w-14 h-14',
  price: 'text-sm text-gray-500',
  title: 'text-md font-semibold',
  nextBilling: 'text-sm text-green-700 mt-4',
  rowBetween: 'flex-row justify-between items-center',
};
export default SubscriptionCard;
