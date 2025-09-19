import { memo } from 'react';

import { clsx } from 'clsx';
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

import { useRealtime } from '@/hooks/useRealtime';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  classNameTop?: string;
  classNameBottom?: string;
  enableBottomSafeArea?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = memo(
  function ScreenContainer({
    children,
    className,
    classNameTop,
    classNameBottom,
    enableBottomSafeArea = true,
    style,
    ...props
  }) {
    useRealtime([
      'follows',
      'blocked_users',
      'post_comments',
      'messages',
      'favorites',
    ]);
    const isAndroid = Platform.OS === 'android';
    const insets = useSafeAreaInsets();

    return (
      <>
        {!isAndroid ? (
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
            style={isAndroid ? { paddingTop: insets.top } : {}}
          />
        )}
        <View className={classes.container}>
          <SafeAreaView
            edges={enableBottomSafeArea && isAndroid ? ['bottom'] : []}
            className={clsx(classes.content, className)}
            {...props}
          >
            {children}
          </SafeAreaView>
        </View>
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
  container: 'flex-1 bg-off-white',
  content: 'flex-1',
};

export default ScreenContainer;
