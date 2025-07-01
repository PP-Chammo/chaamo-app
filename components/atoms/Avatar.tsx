import React, { memo, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image, TouchableOpacity, View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface AvatarProps {
  size: number;
  className?: string;
  imageUrl?: string;
  imageContainerClassName?: string;
  onPress?: () => void;
}

const Avatar = memo(function Avatar({
  size,
  className,
  imageContainerClassName,
  imageUrl,
  onPress,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={className}
      disabled={!onPress}
    >
      <View className={clsx(classes.imageContainer, imageContainerClassName)}>
        {imageUrl && !imageError ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              onError={() => {
                setImageError(true);
              }}
              width={size}
              height={size}
              className={clsx(classes.image)}
              resizeMode="cover"
            />
            {onPress && (
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={getColor('slate-600')}
                className={classes.modifyIcon}
              />
            )}
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="account" size={size} color="white" />
            {onPress && (
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={getColor('slate-600')}
                className={classes.modifyIcon}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  imageContainer:
    'items-center justify-center bg-slate-300 rounded-full self-center',
  modifyIcon: 'absolute bottom-1 right-1 bg-green-50 rounded-full p-1',
  image: 'rounded-full border border-blue-50',
};

export default Avatar;
