import React, { memo } from 'react';

import { clsx } from 'clsx';
import { View } from 'react-native';

import { Button, Label } from '@/components/atoms';

interface AuctionDetailBottomBarProps {
  showModal: boolean;
  onBidNowPress: () => void;
}

const AuctionDetailBottomBar: React.FC<AuctionDetailBottomBarProps> = memo(
  function AuctionDetailBottomBar({ showModal, onBidNowPress }) {
    return (
      <View className={clsx(classes.bottomBar, { hidden: showModal })}>
        <View className={classes.timeBarInner}>
          <Label className={classes.timeText}>7d 15h</Label>
        </View>
        <View className={classes.bottomBarLeft}>
          <Label className={classes.highestBidLabel}>Highest Bid</Label>
          <Label className={classes.highestBidValue}>$400</Label>
        </View>
        <Button
          variant="white-light"
          size="small"
          className={classes.bidButton}
          textClassName={classes.bidText}
          onPress={onBidNowPress}
        >
          Bid Now
        </Button>
      </View>
    );
  },
);

export default AuctionDetailBottomBar;

const classes = {
  bottomBar:
    'z-10 absolute left-0 right-0 bottom-0 flex-row items-center p-4.5 bg-primary-500 z-50',
  timeBarInner:
    'absolute -top-7 left-0 right-0 bg-amber-50 py-1 flex flex-row justify-center items-center rounded-t-xl',
  timeText: 'text-sm font-bold',
  bottomBarLeft: 'flex-1 justify-center',
  highestBidLabel: 'text-white font-semibold',
  highestBidValue: 'text-white text-lg font-bold',
  bidButton: 'flex-[0.4]',
  bidText: 'text-white',
};
