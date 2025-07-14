import { memo } from 'react';

import { clsx } from 'clsx';
import { View, ViewProps } from 'react-native';

interface RowProps extends ViewProps {
  center?: boolean;
  right?: boolean;
  between?: boolean;
  className?: string;
}

const Row: React.FC<RowProps> = memo(function Row({
  children,
  className,
  ...props
}) {
  return (
    <View
      className={clsx(
        classes.container,
        props.center && classes.justify?.center,
        props.right && classes.justify?.right,
        props.between && classes.justify?.between,
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
});

const classes = {
  container: 'flex-row items-center gap-1',
  justify: {
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  },
};

export default Row;
