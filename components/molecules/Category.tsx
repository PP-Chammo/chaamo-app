import { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CategoryProps = {
  title: string;
  image?: React.FC<SvgProps>;
  horizontal?: boolean;
  onPress?: (title: string) => void;
};

const CategoryItem: React.FC<CategoryProps> = memo(function CategoryItem({
  title,
  image,
  horizontal = false,
  onPress,
}) {
  const SvgImage = useMemo(() => image as React.FC<SvgProps>, [image]);

  return (
    <TouchableOpacity
      testID="category-item"
      onPress={() => onPress && onPress(title)}
      className={clsx(
        classes.container,
        horizontal && classes.horizontalContainer,
      )}
    >
      <View
        className={clsx(
          classes.logoContainer,
          horizontal && classes.horizontalLogo,
        )}
      >
        <View className={classes.logo}>
          {image ? (
            <SvgImage />
          ) : (
            <Icon
              testID="default-icon"
              name="cards-outliner"
              size={40}
              color={getColor('gray-400')}
            />
          )}
        </View>
        <Label className="text-sm text-gray-700 mt-1">{title}</Label>
      </View>
      {horizontal && (
        <Icon
          testID="chevron-icon"
          name="chevron-right"
          size={20}
          color={getColor('gray-400')}
          className="justify-self-end-safe"
        />
      )}
    </TouchableOpacity>
  );
});

const classes = {
  container: 'flex flex-row items-center gap-2',
  logoContainer: 'flex flex-col gap-2 items-center',
  horizontalContainer: '!justify-between',
  horizontalLogo: '!flex-row items-center gap-2',
  logo: 'bg-white w-20 h-20 flex items-center justify-center rounded-full',
};

export default CategoryItem;
