import React, { useRef, useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';

import EBayImage from '@/assets/svg/ebay.svg';
import {
  Icon,
  Label,
  ScreenContainer,
  ContextMenu,
  Row,
} from '@/components/atoms';
import { Chart, Header } from '@/components/molecules';
import {
  dummyPortfolioValueData,
  dummyPortoflioDetail,
} from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function PortfolioDetailScreen() {
  const card = dummyPortoflioDetail;

  // Context menu state & ref
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const dotsRef = useRef<View>(null);

  const handleOpenMenu = React.useCallback(
    () => setIsContextMenuVisible(true),
    [],
  );
  const handleCloseMenu = React.useCallback(
    () => setIsContextMenuVisible(false),
    [],
  );
  const handleDeletePopup = React.useCallback(() => {
    setIsContextMenuVisible(false);
    Alert.alert(
      'Delete this post?',
      'Are you sure you want to delete this post. it will be deleted permanently and cannot be resorted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('delete') },
      ],
    );
  }, []);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={classes.scrollView}
        stickyHeaderIndices={[0]}
      >
        <View className="relative">
          <Header
            onBackPress={() => router.back()}
            className={classes.header}
            rightIcon="dots-vertical"
            rightIconColor={getColor('gray-600')}
            rightIconSize={28}
            onRightPress={handleOpenMenu}
            rightRef={dotsRef}
          />
          <ContextMenu
            visible={isContextMenuVisible}
            onClose={handleCloseMenu}
            triggerRef={dotsRef}
            menuHeight={-10} // 3 row * 44px (py-2 px-3)
          >
            <TouchableOpacity
              className={classes.contextMenuItem}
              onPress={handleCloseMenu}
            >
              <Label>Boost Post</Label>
            </TouchableOpacity>
            <View className={classes.contextMenuDivider} />
            <TouchableOpacity
              className={classes.contextMenuItem}
              onPress={handleCloseMenu}
            >
              <Label>Edit Details</Label>
            </TouchableOpacity>
            <View className={classes.contextMenuDivider} />
            <TouchableOpacity
              className={classes.contextMenuDelete}
              onPress={handleDeletePopup}
            >
              <Label className="!text-red-600">Delete</Label>
            </TouchableOpacity>
          </ContextMenu>
        </View>
        <View className={classes.cardImageWrapper}>
          <View className={classes.cardImage}>
            <Icon name="cards-outline" size={64} color={getColor('gray-400')} />
          </View>
        </View>
        <View className={classes.priceRow}>
          <Label variant="subtitle" className={classes.price}>
            ${card.currentPrice}
          </Label>
          <Row className={classes.dateRow}>
            <Icon
              name="calendar"
              variant="SimpleLineIcons"
              size={12}
              color={getColor('gray-400')}
            />
            <Label className={classes.date}>
              {formatDistanceToNow(new Date(card.date), { addSuffix: true })}
            </Label>
          </Row>
        </View>
        <Label variant="subtitle" className={classes.name}>
          {card.title}
        </Label>
        <View className={classes.ebayRow}>
          <EBayImage />
          <Label className={classes.priceValueLabel}>Price Value: </Label>
          <Label className={classes.priceValue}>{card.bidPrice}</Label>
        </View>
        <View className={classes.descriptionWrapper}>
          <Label className={classes.descriptionTitle}>Description</Label>
          <Label className={classes.description}>{card.description}</Label>
        </View>
        <View className={classes.chartWrapper}>
          <Chart data={dummyPortfolioValueData} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  header: '!bg-transparent !px-0',
  scrollView: 'px-4.5',
  cardImageWrapper: 'items-center mt-4',
  cardImage:
    'w-56 h-80 rounded-xl border border-gray-200 bg-gray-200 items-center justify-center',
  priceRow: 'mt-4 flex-row items-center justify-between',
  price: 'text-primary-500 text-xl font-bold',
  date: 'text-xs text-gray-400',
  name: 'text-lg font-semibold mt-1',
  ebayRow: 'flex-row items-center mt-1 gap-1',
  descriptionWrapper: 'mt-4',
  descriptionTitle: 'text-base font-semibold mb-1',
  description: 'text-sm text-gray-700',
  chartWrapper: 'mt-6 mb-8',
  priceValueLabel: 'text-xs text-gray-500',
  priceValue: 'text-xs text-gray-700 font-bold',
  contextMenuItem: 'py-2 px-3',
  contextMenuDelete: 'py-2 px-3 !text-red-900',
  contextMenuDivider: 'h-px bg-gray-200',
  dateRow: 'gap-1.5',
};
