import { memo } from 'react';

import { View } from 'react-native';

import { Avatar, Button, Label } from '@/components/atoms';

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
        <Avatar imageUrl={imageUrl} size={50} />
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
  fullname: '!text-gray-700',
};

export default People;
