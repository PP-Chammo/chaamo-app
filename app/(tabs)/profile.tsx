import { useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';
import pluralize from 'pluralize';
import { TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  Divider,
  Icon,
  Label,
  ProfileStat,
  ScreenContainer,
} from '@/components/atoms';
import { Header, Lazy, TabView } from '@/components/molecules';
import { profileTabs } from '@/constants/tabs';
import { useGetFollowsLazyQuery } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ProfileScreen() {
  const [user] = useUserVar();

  const [getFollowers, { data: followersData }] = useGetFollowsLazyQuery();
  const [getFollowings, { data: followingData }] = useGetFollowsLazyQuery();

  useFocusEffect(
    useCallback(() => {
      getFollowers({
        variables: {
          filter: {
            followee_user_id: { eq: user?.id },
          },
        },
      });
      getFollowings({
        variables: {
          filter: {
            follower_user_id: { eq: user?.id },
          },
        },
      });
    }, [getFollowers, getFollowings, user?.id]),
  );

  const followersCount = useMemo(() => {
    return followersData?.followsCollection?.edges?.length ?? [];
  }, [followersData?.followsCollection?.edges]);

  const followingsCount = useMemo(() => {
    return followingData?.followsCollection?.edges?.length ?? [];
  }, [followingData?.followsCollection?.edges]);

  const handleSettingsPress = useCallback(() => {
    router.push('/screens/settings');
  }, []);

  const handlePortfolioValuePress = useCallback(() => {
    router.push('/screens/portfolio-value');
  }, []);

  const handleFollowersPress = useCallback(() => {
    router.push('/screens/followers');
  }, []);

  const handleFollowingPress = useCallback(() => {
    router.push('/screens/followings');
  }, []);

  const handleEditProfilePress = useCallback(() => {
    router.push('/screens/personal-details');
  }, []);

  return (
    <ScreenContainer className={classes.container} enableBottomSafeArea={false}>
      <Header
        title="Profile"
        rightIcon="menu"
        onRightPress={handleSettingsPress}
      />
      <View className={classes.profileContainer}>
        <Avatar
          size="lg"
          imageUrl={
            user?.profile?.profile_image_url ?? user?.user_metadata?.avatar_url
          }
        />
        <View className={classes.profileInfoContainer}>
          <Label variant="title" className={classes.profileName}>
            {user?.profile?.username ?? user?.user_metadata?.name}
          </Label>
          <View className={classes.portfolioContainer}>
            <Label className={classes.portfolioValueLabel}>
              Portfolio Value:
            </Label>
            <TouchableOpacity
              onPress={handlePortfolioValuePress}
              className={classes.portfolioValueContainer}
            >
              <Label className={classes.portfolioValue}>$2000</Label>
              <View className={classes.portfolioValueIconContainer}>
                <Icon
                  name="arrow-up-right"
                  size={16}
                  color={getColor('primary-500')}
                  variant="Feather"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className={classes.profileStatsContainer}>
        <ProfileStat title="Listing" value="5" />
        <Divider />
        <ProfileStat
          title={pluralize('Followers', Number(followersCount))}
          value={followersCount.toString()}
          onPress={handleFollowersPress}
        />
        <Divider />
        <ProfileStat
          title={pluralize('Following', Number(followingsCount))}
          value={followingsCount.toString()}
          onPress={handleFollowingPress}
        />
      </View>

      <Button
        icon="pencil-outline"
        className={classes.editProfileButton}
        onPress={handleEditProfilePress}
      >
        Edit Profile
      </Button>
      <TabView className={classes.tabView} tabs={profileTabs}>
        <Lazy
          load={() => import('@/components/organisms/PortfolioProfile')}
          fallback={<Label>Loading...</Label>}
        />
        <Lazy
          load={() => import('@/components/organisms/SoldItemsProfile')}
          fallback={<Label>Loading...</Label>}
        />
        <Lazy
          load={() => import('@/components/organisms/StatsProfile')}
          fallback={<Label>Loading...</Label>}
        />
        <Lazy
          load={() => import('@/components/organisms/ReviewsProfile')}
          fallback={<Label>Loading...</Label>}
        />
      </TabView>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  profileContainer: 'flex-row gap-5 mt-2 px-4.5 items-center',
  profileInfoContainer: 'gap-2',
  profileName: 'text-3xl font-bold',
  portfolioContainer: 'flex-row items-center gap-1',
  portfolioValueContainer: 'flex-row items-center gap-1',
  portfolioValueLabel: 'flex-row items-center text-md text-slate-500',
  portfolioValue: '!text-primary-500 font-bold',
  portfolioValueIconContainer: 'border border-primary-500 rounded-full',
  profileStatsContainer: 'flex-row justify-between mx-12 my-8',
  tabView: 'mt-10',
  editProfileButton: 'mx-4.5',
};
