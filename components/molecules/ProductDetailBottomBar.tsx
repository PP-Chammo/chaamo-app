import React, { memo } from 'react';

import { clsx } from 'clsx';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { Button, Row } from '@/components/atoms';

interface ProductDetailBottomBarProps {
  showModal: boolean;
  onBuyNowPress: () => void;
  onMakeAnOfferPress: () => void;
}

const ProductDetailBottomBar: React.FC<ProductDetailBottomBarProps> = memo(
  function ProductDetailBottomBar({
    showModal,
    onBuyNowPress,
    onMakeAnOfferPress,
  }) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Row className={clsx(classes.container, { hidden: showModal })}>
          <Button
            variant="primary-light"
            size="small"
            className={classes.makeAnOfferButton}
            icon="bubbles"
            iconVariant="SimpleLineIcons"
            onPress={onMakeAnOfferPress}
          >
            Make an Offer
          </Button>
          <Button
            variant="primary"
            size="small"
            className={classes.buyNowButton}
            icon="shopping-bag"
            iconVariant="Feather"
            onPress={onBuyNowPress}
          >
            Buy Now
          </Button>
        </Row>
      </KeyboardAvoidingView>
    );
  },
);

export default ProductDetailBottomBar;

const classes = {
  container: 'z-10 absolute left-0 right-0 bottom-0 gap-4.5 p-4.5 bg-white',
  timeBarInner:
    'absolute -top-7 left-0 right-0 bg-amber-50 py-1 flex flex-row justify-center items-center rounded-t-xl',
  timeText: 'text-sm font-bold',
  bottomBarLeft: 'flex-1 justify-center',
  highestBidLabel: 'text-white text-lg font-semibold',
  highestBidValue: 'text-white text-2xl font-bold mt-1',
  makeAnOfferButton: 'flex-[0.5]',
  buyNowButton: 'flex-[0.5]',
};
