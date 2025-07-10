import React from 'react';

import { router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { Label, ScreenContainer } from '@/components/atoms';
import { Header, WishListItem } from '@/components/molecules';
import { dummyWishList } from '@/constants/dummy';

export default function WishlistScreen() {
  return (
    <ScreenContainer>
      <Header title="Wishlist" onBackPress={() => router.back()} />
      <View className="p-4.5">
        <Label variant="title" className="text-slate-800 !text-sm my-4.5">
          {dummyWishList.length} saved items
        </Label>
        <FlatList
          data={dummyWishList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName={classes.contentContainer}
          renderItem={({ item }) => <WishListItem {...item} />}
        />
      </View>
    </ScreenContainer>
  );
}

const classes = {
  contentContainer: 'gap-6',
};
