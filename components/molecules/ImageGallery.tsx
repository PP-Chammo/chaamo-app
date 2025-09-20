import React, { memo, useState } from 'react';

import { clsx } from 'clsx';
import { Image } from 'expo-image';
import { Modal, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import PagerView from 'react-native-pager-view';

import { Icon } from '@/components/atoms';
import { getColor } from '@/utils/getColor';
import { parseImageUrls } from '@/utils/imageUrls';

interface ImageGalleryProps {
  imageUrls: string | string[] | null;
  className?: string;
  imageClassName?: string;
  showIndicators?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = memo(function ImageGallery({
  imageUrls,
  className,
  imageClassName,
  showIndicators = true,
}) {
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = Array.isArray(imageUrls)
    ? imageUrls
    : parseImageUrls(imageUrls);

  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setShowImageZoom(true);
  };

  if (!images.length) {
    return (
      <View className={clsx(classes.placeholderContainer, className)}>
        <View className={classes.placeholder}>
          <Icon name="cards-outline" size={64} color={getColor('gray-400')} />
        </View>
      </View>
    );
  }

  return (
    <View className={clsx(classes.container, className)}>
      <View className={classes.imageWrapper}>
        <PagerView
          className={classes.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
        >
          {images.map((item, index) => (
            <View key={`${item}-${index}`} className={classes.pageContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleImagePress(index)}
                className={classes.imageContainer}
              >
                <Image
                  source={{ uri: item }}
                  className={classes.image}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            </View>
          ))}
        </PagerView>
      </View>

      {showIndicators && images.length > 1 && (
        <View className={classes.indicatorContainer}>
          <View className={classes.indicatorList}>
            {images.map((_, index) => (
              <View
                key={index}
                className={clsx(
                  classes.indicator,
                  index === currentIndex
                    ? classes.activeIndicator
                    : classes.inactiveIndicator,
                )}
              />
            ))}
          </View>
        </View>
      )}

      {images.length > 0 && (
        <Modal visible={showImageZoom} transparent={true}>
          <ImageViewer
            imageUrls={images.map((url) => ({ url }))}
            index={currentIndex}
            onSwipeDown={() => setShowImageZoom(false)}
            enableImageZoom={true}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableOpacity
                onPress={() => setShowImageZoom(false)}
                className={classes.closeButton}
              >
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
            backgroundColor="rgba(0,0,0,0.9)"
            renderIndicator={(currentIndex, allSize) => (
              <View className={classes.zoomIndicatorContainer}>
                <View className={classes.zoomIndicator}>
                  {Array.from({ length: allSize || 0 }, (_, index) => (
                    <View
                      key={index}
                      className={clsx(
                        classes.zoomDot,
                        index === currentIndex
                          ? classes.zoomActiveDot
                          : classes.zoomInactiveDot,
                      )}
                    />
                  ))}
                </View>
              </View>
            )}
          />
        </Modal>
      )}
    </View>
  );
});

export default ImageGallery;

const classes = {
  container: 'relative w-full flex items-center justify-center',
  placeholderContainer: 'w-full flex items-center justify-center',
  placeholder:
    'w-56 aspect-[7/10] bg-gray-200 rounded-lg flex items-center justify-center',
  imageWrapper: 'relative w-56 aspect-[7/10]',
  pagerView: 'w-full h-full',
  pageContainer: 'w-full h-full flex items-center justify-center',
  imageContainer: 'w-full h-full',
  image: 'w-full h-full rounded-lg',
  indicatorContainer:
    'absolute bottom-4 left-0 right-0 flex items-center justify-center z-10',
  indicatorList: 'flex-row items-center justify-center',
  indicator: 'w-2 h-2 rounded-full mx-1',
  activeIndicator: 'bg-white',
  inactiveIndicator: 'bg-white/50',
  closeButton: 'absolute top-12 right-5 z-10 bg-black/50 rounded-full p-2',
  zoomIndicatorContainer:
    'absolute bottom-12 left-0 right-0 flex items-center justify-center',
  zoomIndicator: 'flex-row bg-black/50 rounded-full px-3 py-2',
  zoomDot: 'w-2 h-2 rounded-full mx-1',
  zoomActiveDot: 'bg-white',
  zoomInactiveDot: 'bg-white/50',
};
