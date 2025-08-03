import { Fragment, useCallback, useRef, useState } from 'react';

import { router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Divider,
  Label,
  ProfileStat,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import {
  AboutProfile,
  PortfolioProfile,
  ReviewsProfile,
  SoldItemsProfile,
} from '@/components/organisms';
import { profileTabs } from '@/constants/tabs';

export default function PublicProfileScreen() {
  const [isContextMenuVisible, setIsContextMenuVisible] =
    useState<boolean>(false);

  const dotsRef = useRef<View>(null);

  const handleContextMenuPress = useCallback(() => {
    setIsContextMenuVisible(true);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
  }, []);

  const handleBlock = useCallback(() => {
    Alert.alert('Blocked', 'User Blocked');
    handleCloseContextMenu();
  }, [handleCloseContextMenu]);

  const handleUnfollow = useCallback(() => {
    Alert.alert('Unfollowed', 'User Unfollowed');
    handleCloseContextMenu();
  }, [handleCloseContextMenu]);

  return (
    <Fragment>
      <ScreenContainer className={classes.container}>
        <Header
          rightIcon="dots-vertical"
          onBackPress={() => router.back()}
          onRightPress={handleContextMenuPress}
          rightRef={dotsRef}
        />
        <View className={classes.profileContainer}>
          <Avatar
            size="xl"
            imageContainerClassName={classes.avatarImageContainer}
          />
          <View className={classes.profileInfoContainer}>
            <Label variant="title" className={classes.profileName}>
              John Doe
            </Label>
          </View>
        </View>

        <View className={classes.profileStatsContainer}>
          <ProfileStat title="Listing" value="5" />
          <Divider />
          <ProfileStat
            title="Followers"
            value="8"
            onPress={() => router.push('/screens/followers')}
          />
          <Divider />
          <ProfileStat
            title="Following"
            value="51"
            onPress={() => router.push('/screens/followings')}
          />
        </View>
        <Row className={classes.buttonContainer}>
          <Button
            iconVariant="AntDesign"
            icon="adduser"
            className={classes.button}
          >
            Follow
          </Button>
          <Button
            variant="light"
            icon="message-processing-outline"
            className={classes.button}
          >
            Message
          </Button>
        </Row>
        <TabView className={classes.tabView} tabs={profileTabs}>
          <PortfolioProfile />
          <SoldItemsProfile />
          <AboutProfile />
          <ReviewsProfile />
        </TabView>
      </ScreenContainer>

      <ContextMenu
        visible={isContextMenuVisible}
        onClose={handleCloseContextMenu}
        triggerRef={dotsRef}
        menuHeight={20}
      >
        <TouchableOpacity onPress={handleUnfollow}>
          <Label className={classes.unfollowText}>Remove from followers</Label>
        </TouchableOpacity>
        <Divider position="horizontal" />
        <TouchableOpacity onPress={handleBlock}>
          <Label className={classes.blockText}>Block</Label>
        </TouchableOpacity>
      </ContextMenu>
    </Fragment>
  );
}

const classes = {
  container: 'flex-1',
  profileContainer: 'flex-row gap-5 mt-2 px-4.5 items-center',
  avatarImageContainer: 'border-2 border-white',
  profileInfoContainer: 'gap-2',
  profileName: 'text-3xl font-bold',
  portfolioValueContainer: 'flex-row items-center gap-1',
  portfolioValueLabel: 'flex-row items-center text-md text-slate-500',
  portfolioValue: 'text-primary-500 font-bold',
  portfolioValueIconContainer: 'border border-primary-500 rounded-full',
  profileStatsContainer: 'flex-row justify-between mx-12 my-8',
  tabView: 'mt-10',
  buttonContainer: 'gap-4 px-4.5',
  button: 'flex-1',
  blockText: '!text-red-600 text-sm',
  unfollowText: '!text-slate-600 text-sm',
};
