import { memo } from 'react';

import { Image, View } from 'react-native';

import { Button, Label } from '@/components/atoms';

interface PeopleProps {
  fullname: string;
  imageUrl?: string;
  onFollowPress: () => void;
}

const People: React.FC<PeopleProps> = memo(function Badge({
  fullname,
  imageUrl,
  onFollowPress,
}) {
  return (
    <View className={classes.container}>
      <View className={classes.imageContainer}>
        <Image source={{ uri: imageUrl }} className={classes.image} />
        <Label variant="subtitle" className={classes.fullname}>
          {fullname}
        </Label>
      </View>
      <Button size="small" onPress={onFollowPress}>
        Follow
      </Button>
    </View>
  );
});

const classes = {
  container: 'w-full flex flex-row justify-between items-center',
  imageContainer: 'flex flex-row items-center gap-3',
  image: 'w-16 h-16 bg-gray-100 rounded-full border border-gray-200',
  fullname: '!text-gray-700',
};

export default People;
