import { memo } from 'react';

import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { SafeAreaView, View, ViewProps } from 'react-native';

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
      <>
        <SafeAreaView className={clsx(classes.containerTop, classNameTop)} />
        <SafeAreaView className={classes.container} style={style} {...props}>
          {className?.includes('bg-') ? (
            <View className={clsx(classes.container, className)} style={style}>
              {children}
            </View>
          ) : (
            <StyledGradient
              colors={[getColor('orange-50'), getColor('primary-50')]}
              className={clsx(classes.container, className)}
            >
              {children}
            </StyledGradient>
          )}
        </SafeAreaView>
        <SafeAreaView
          className={clsx(classes.containerBottom, classNameBottom)}
        />
      </>
    );
  },
);

const classes = {
  containerTop: 'bg-orange-50',
  container: 'flex-1',
  containerBottom: 'bg-primary-50',
};

export default ScreenContainer;
