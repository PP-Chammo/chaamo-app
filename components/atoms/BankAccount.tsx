import { memo } from 'react';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface BankAccountProps {
  cardNumber: string;
  onPress: () => void;
}

const BankAccount: React.FC<BankAccountProps> = memo(function BankAccount({
  cardNumber,
  onPress,
}) {
  return (
    <View className={classes.container}>
      <View className={classes.cardInfoContainer}>
        <MaterialCommunityIcons
          name="bank-outline"
          size={20}
          color={getColor('slate-400')}
        />
        <Text className={classes.cardInfoText}>
          Bank account ending in 6754
        </Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <Entypo
          name="dots-three-horizontal"
          size={20}
          color={getColor('slate-400')}
        />
      </TouchableOpacity>
    </View>
  );
});

const classes = {
  container: 'flex-row justify-between items-center',
  cardInfoContainer: 'flex-row items-center gap-2',
  cardInfoText: 'text-md text-slate-600',
  dotsContainer: 'flex-row items-center gap-2',
};

export default BankAccount;
