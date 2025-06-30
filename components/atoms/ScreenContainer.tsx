import { memo } from 'react';

import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { SafeAreaView, ViewProps } from 'react-native';

import { getColor } from '@/utils/getColor';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  classNameTop?: string;
}

const StyledGradient = cssInterop(LinearGradient, {
  className: { target: 'style' },
});

const ScreenContainer: React.FC<ScreenContainerProps> = memo(
  function ScreenContainer({
    children,
    className,
    classNameTop,
    style,
    ...props
  }) {
    return (
      <>
        <SafeAreaView className={clsx(classes.containerTop, classNameTop)} />
        <SafeAreaView className={classes.container} style={style} {...props}>
          <StyledGradient
            colors={[getColor('orange-50'), getColor('teal-50')]}
            className={clsx(classes.container, className)}
          >
            {children}
          </StyledGradient>
        </SafeAreaView>
        <SafeAreaView className={classes.containerBottom} />
      </>
    );
  },
);

const classes = {
  containerTop: 'bg-orange-50',
  container: 'flex-1',
  containerBottom: 'bg-teal-50',
};

export default ScreenContainer;
