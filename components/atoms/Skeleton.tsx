import React, { memo } from 'react';

import SkeletonLoading from 'expo-skeleton-loading';

import { getColor } from '@/utils/getColor';

type SkeletonLoadingProps = {
  background?: string;
  highlight?: string;
  children?: React.ReactNode;
};

const SkeletonLoadingComponent =
  SkeletonLoading as unknown as React.ComponentType<SkeletonLoadingProps>;

const Skeleton: React.FC<React.PropsWithChildren> = memo(function Skeleton({
  children,
}) {
  return (
    <SkeletonLoadingComponent
      background={getColor('slate-300')}
      highlight={getColor('white')}
    >
      {children}
    </SkeletonLoadingComponent>
  );
});

export default Skeleton;
