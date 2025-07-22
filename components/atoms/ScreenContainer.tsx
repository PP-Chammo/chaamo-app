import { memo } from 'react';

import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getColor } from '@/utils/getColor';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  classNameTop?: string;
  classNameBottom?: string;
}

const StyledGradient = cssInterop(LinearGradient, {
  className: { target: 'style' },
});

const ScreenContainer: React.FC<ScreenContainerProps> = memo(
  function ScreenContainer({
    children,
    className,
    classNameTop,
    classNameBottom,
    style,
    ...props
  }) {
    return (
      <StyledGradient
        colors={[getColor('orange-50'), getColor('primary-50')]}
        className="flex-1"
      >
        <SafeAreaView
          edges={['top', 'bottom']}
          className={clsx(classes.container, className)}
          {...props}
        >
          {children}
        </SafeAreaView>
      </StyledGradient>
    );
  },
);

const classes = {
  container: 'flex-1',
};

export default ScreenContainer;
