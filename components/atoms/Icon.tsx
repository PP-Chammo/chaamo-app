import { memo } from 'react';

import * as _Icons from '@expo/vector-icons';

type IconComponentType = React.ComponentType<object>;
type IconVariants = keyof typeof Icons;
type IconsType = {
  [K in keyof typeof _Icons]: (typeof _Icons)[K] extends IconComponentType
    ? (typeof _Icons)[K]
    : never;
};

const Icons = _Icons as IconsType;

type IconProps<V extends IconVariants> = React.ComponentProps<
  (typeof Icons)[V]
> & {
  variant: V;
  className?: string;
};

const Icon = memo(function Icon<V extends IconVariants>({
  variant = 'MaterialCommunityIcons' as V,
  size = 28,
  className,
  ...props
}: IconProps<V>) {
  const Component = Icons[variant as IconVariants];
  return <Component className={className} size={size} {...props} />;
});

export default Icon;
