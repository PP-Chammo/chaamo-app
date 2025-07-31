import { memo } from 'react';

import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import {
  Platform,
  SafeAreaView as RNSafeAreaView,
  View,
  ViewProps,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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
    const insets = useSafeAreaInsets();
    return (
      <>
        {Platform.OS === 'ios' ? (
          <RNSafeAreaView
            className={clsx(classNameTop, {
              'bg-slate-50': !classNameTop?.includes('bg-'),
            })}
          />
        ) : (
          <View
            className={clsx(classNameTop, {
              'bg-slate-50': !classNameTop?.includes('bg-'),
            })}
            style={Platform.OS === 'android' ? { paddingTop: insets.top } : {}}
          />
        )}
        <StyledGradient
          colors={[getColor('slate-50'), getColor('slate-50')]}
          className="flex-1"
        >
          <SafeAreaView
            edges={[]}
            className={clsx(classes.container, className)}
            {...props}
          >
            {children}
          </SafeAreaView>
        </StyledGradient>
        <RNSafeAreaView
          className={clsx(classNameBottom, {
            'bg-slate-50': !classNameBottom?.includes('bg-'),
          })}
        />
      </>
    );
  },
);

const classes = {
  container: 'flex-1',
};

export default ScreenContainer;
