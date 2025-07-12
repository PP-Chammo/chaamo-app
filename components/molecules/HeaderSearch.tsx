import React, { memo } from 'react';

import { clsx } from 'clsx';
import { TouchableOpacity, View } from 'react-native';

import { Icon, SearchField } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface HeaderSearchProps {
  value: string;
  onChange: (value: TextChangeParams) => void;
  onBackPress?: () => void;
  onSubmit?: () => void;
  className?: string;
}

const HeaderSearch: React.FC<HeaderSearchProps> = memo(function HeaderSearch({
  value,
  onChange,
  onBackPress,
  onSubmit,
  className,
}) {
  return (
    <View testID="header-search" className={clsx(classes.header, className)}>
      {onBackPress && (
        <TouchableOpacity
          testID="back-button"
          onPress={onBackPress}
          className={classes.backButton}
        >
          <Icon name="arrow-left" size={24} color={getColor('slate-700')} />
        </TouchableOpacity>
      )}
      <SearchField
        testID="search-field"
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </View>
  );
});

const classes = {
  header:
    'bg-white flex flex-row items-cente justify-between gap-2 border-b-0 pl-4 pr-5 py-5',
  backButton: 'w-10 items-start justify-center',
};

export default HeaderSearch;
