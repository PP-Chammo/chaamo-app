import { memo } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { SafeAreaView, ViewProps } from 'react-native';

import { getColor } from '@/utils/getColor';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

const StyledGradient = cssInterop(LinearGradient, {
  className: { target: 'style' },
});

const ScreenContainer: React.FC<ScreenContainerProps> = memo(
  function ScreenContainer({ children, style, ...props }) {
    return (
      <>
        <SafeAreaView className={classes.containerTop} />
        <SafeAreaView className={classes.container} style={style} {...props}>
          <StyledGradient
            colors={[getColor('orange-50'), getColor('teal-50')]}
            className="flex-1 p-6"
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
