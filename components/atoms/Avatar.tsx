import React, { Fragment, memo, useMemo, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { getColor } from '@/utils/getColor';

interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imageUrl?: string | null;
  imageContainerClassName?: string;
  onPress?: () => void;
  testID?: string;
  loading?: boolean;
}

const Avatar = memo(function Avatar({
  size = 'md',
  className,
  imageContainerClassName,
  imageUrl,
  onPress,
  testID,
  loading,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getPlusIconSize = useMemo(() => {
    if (size === 'xs') return 18;
    if (size === 'sm') return 32;
    if (size === 'md') return 36;
    if (size === 'lg') return 70;
    if (size === 'xl') return 96;
  }, [size]);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className={className}
      disabled={!onPress}
    >
      <View
        className={clsx(
          classes.imageContainer,
          classes.imageSize[size],
          imageContainerClassName,
        )}
      >
        {loading ? (
          <ActivityIndicator size="large" color={getColor('primary-500')} />
        ) : (
          <>
            {imageUrl && !imageError ? (
              <Fragment>
                <Image
                  source={{ uri: imageUrl }}
                  onError={() => {
                    setImageError(true);
                  }}
                  className={clsx(
                    classes.imageSize[size],
                    classes.image,
                    imageContainerClassName,
                  )}
                  contentFit="cover"
                />
                {onPress && (
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={getColor('slate-700')}
                    className={classes.modifyIcon}
                  />
                )}
              </Fragment>
            ) : (
              <Fragment>
                <MaterialCommunityIcons
                  name="account"
                  size={getPlusIconSize}
                  color="white"
                />
                {onPress && (
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color={getColor('slate-700')}
                    className={classes.modifyIcon}
                  />
                )}
              </Fragment>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  imageSize: {
    xs: 'w-10 h-10',
    sm: 'w-14 h-14',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  },
  imageContainer:
    'flex items-center justify-center bg-slate-300 rounded-full self-center',
  modifyIcon: 'absolute bottom-2 right-0 bg-primary-100 rounded-full p-1',
  image: 'rounded-full border-2 border-white',
};

export default Avatar;
