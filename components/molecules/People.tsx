import { ComponentProps, memo } from 'react';

import { Pressable, TouchableOpacity, View } from 'react-native';

import { Avatar, Button, Label } from '@/components/atoms';

interface PeopleProps {
  followed?: boolean;
  fullname: string;
  imageUrl?: string;
  size?: ComponentProps<typeof Avatar>['size'];
  onPress?: () => void;
  onFollowPress?: () => void;
  onViewProfilePress?: () => void;
  isLoading?: boolean;
}

const People: React.FC<PeopleProps> = memo(function People({
  followed,
  fullname,
  imageUrl,
  size,
  onPress,
  onFollowPress,
  onViewProfilePress,
  isLoading,
}) {
  return (
    <Pressable
      testID="people-item"
      onPress={onPress}
      className={classes.container}
    >
      <View className={classes.imageContainer}>
        <Avatar testID="avatar" imageUrl={imageUrl} size={size} />
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
        <Button
          testID="follow-button"
          size="small"
          variant={followed ? 'primary-light' : 'primary'}
          className={classes.followButton}
          onPress={onFollowPress}
          loading={isLoading}
          disabled={isLoading}
        >
          {followed ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </Pressable>
  );
});

const classes = {
  container: 'w-full flex flex-row justify-between items-center',
  imageContainer: 'flex flex-row items-center gap-3',
  fullname: '!text-gray-700',
  viewProfile: 'text-primary-500 underline',
  followButton: '!min-w-28',
};

export default People;
