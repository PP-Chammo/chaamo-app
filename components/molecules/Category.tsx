import { memo, useMemo } from 'react';

import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

type CategoryProps = {
  title: string;
  image?: React.FC<SvgProps>;
};

const CategoryItem: React.FC<CategoryProps> = memo(function CategoryItem({
  title,
  image,
}) {
  const SvgImage = useMemo(() => image as React.FC<SvgProps>, [image]);

  return (
    <View className={classes.container}>
      <View className={classes.logo}>
        {image ? (
          // Render the image component as JSX
          <SvgImage />
        ) : (
          <Icon name="cards-outliner" size={40} color={getColor('gray-400')} />
        )}
      </View>
      <Label className="text-sm text-gray-700 mt-1">{title}</Label>
    </View>
  );
});

const classes = {
  container: 'flex flex-col items-center justify-center gap-2',
  logo: 'bg-white w-20 h-20 flex items-center justify-center rounded-full',
};

export default CategoryItem;
