import { memo } from 'react';

import { Pressable, TouchableOpacity, View } from 'react-native';

import { Avatar, Button, Label } from '@/components/atoms';

interface PeopleProps {
  fullname: string;
  imageUrl?: string;
  onPress?: () => void;
  onFollowPress?: () => void;
  onViewProfilePress?: () => void;
}

const People: React.FC<PeopleProps> = memo(function Badge({
  fullname,
  imageUrl,
  onPress,
  onFollowPress,
  onViewProfilePress,
}) {
  return (
    <Pressable
      testID="people-item"
      onPress={onPress}
      className={classes.container}
    >
      <View className={classes.imageContainer}>
        <Avatar testID="avatar" imageUrl={imageUrl} size={50} />
        <View>
          <Label variant="subtitle" className={classes.fullname}>
            {fullname}
          </Label>
          {onViewProfilePress && (
            <TouchableOpacity onPress={onViewProfilePress}>
              <Label className={classes.viewProfile}>View Profile</Label>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {onFollowPress && (
        <Button size="small" onPress={onFollowPress} testID="follow-button">
          Follow
        </Button>
      )}
    </Pressable>
  );
});

const classes = {
  container: 'w-full flex flex-row justify-between items-center',
  imageContainer: 'flex flex-row items-center gap-3',
  fullname: '!text-gray-700',
  viewProfile: 'text-teal-600 underline',
};

export default People;
