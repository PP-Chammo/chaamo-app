import React, { memo } from 'react';

import SkeletonLoading, { SkeletonProps } from 'expo-skeleton-loading';

import { getColor } from '@/utils/getColor';

const SkeletonCustom = SkeletonLoading as React.FC<SkeletonProps>;

const Skeleton: React.FC<Pick<SkeletonProps, 'children'>> = memo(
  function Skeleton({ children }) {
    return (
      <SkeletonCustom
        background={getColor('slate-300')}
        highlight={getColor('white')}
      >
        {children}
      </SkeletonCustom>
    );
  },
);

export default Skeleton;
