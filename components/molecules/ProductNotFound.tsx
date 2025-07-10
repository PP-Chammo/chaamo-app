import { memo } from 'react';

import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

const ProductNotFound = memo(function ProductNotFound() {
  return (
    <View className={classes.notFoundContainer}>
      <Icon
        name="dizzy"
        variant="FontAwesome6"
        color={getColor('teal-500')}
        size={120}
        className={classes.notFoundIcon}
      />
      <Label>Uh-oh! We couldn`t find that</Label>
      <Button onPress={() => router.back()} variant="primary-light">
        Lets try using different keywords
      </Button>
    </View>
  );
});

const classes = {
  notFoundContainer: 'flex flex-col items-center gap-5 pt-28',
  notFoundIcon: 'opacity-20',
};

export default ProductNotFound;
