import { memo } from 'react';

import { View } from 'react-native';

const Divider = memo(function Divider() {
  return <View className="h-full w-px bg-gray-200 mx-4" />;
});

export default Divider;
