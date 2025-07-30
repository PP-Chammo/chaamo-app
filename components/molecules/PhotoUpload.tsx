import React from 'react';

import { Image, TouchableOpacity, View } from 'react-native';

import { Label } from '@/components/atoms';
import Icon from '@/components/atoms/Icon';
import { getColor } from '@/utils/getColor';

interface PhotoUploadProps {
  imageUrl?: string;
  onPick: () => void;
  onRemove?: () => void;
  loading?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  imageUrl,
  onPick,
  onRemove,
  loading,
}) => {
  if (imageUrl) {
    return (
      <View className={classes.imageContainer}>
        <View className={classes.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            className={classes.image}
            resizeMode="cover"
          />
          {onRemove && (
            <TouchableOpacity
              className={classes.removeImageBtn}
              onPress={onRemove}
              testID="remove-photo-btn"
            >
              <Icon name="close" size={22} color={getColor('slate-400')} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      className={classes.imageUpload}
      onPress={onPick}
      activeOpacity={0.8}
      disabled={loading}
      testID="upload-photo-btn"
    >
      <View className={classes.addPhotoContainer}>
        <Icon name="camera-plus" size={32} color={getColor('primary-500')} />
        <Label className={classes.addPhotoLabel}>Add Photo</Label>
      </View>
    </TouchableOpacity>
  );
};

const classes = {
  imageUpload:
    'border border-dashed border-primary-100 rounded-lg bg-white items-center justify-center min-h-[216px]',
  addPhotoContainer: 'items-center justify-center gap-1',
  addPhotoLabel: 'text-primary-500',

  imageContainer: 'items-center justify-center h-[216px]',
  imageWrapper: 'py-6 px-12 bg-white items-center justify-center',
  image: 'w-36 h-auto min-h-[174px]',
  removeImageBtn:
    'absolute -top-3 -right-3 bg-primary-50 rounded-full w-8 h-8 items-center justify-center z-10 shadow-sm',
};

export default PhotoUpload;
