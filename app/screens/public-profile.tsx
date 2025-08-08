import { Fragment, useCallback, useMemo, useRef, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
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
import { Header, Lazy, TabView } from '@/components/molecules';
import { profileTabs } from '@/constants/tabs';
import {
  useCreateBlockedUsersMutation,
  useCreateFollowsMutation,
  useGetFollowsQuery,
  useGetProfilesQuery,
  useRemoveFollowsMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function PublicProfileScreen() {
  const { publicUserId } = useLocalSearchParams();
  const [user] = useUserVar();

  const { data } = useGetProfilesQuery({
    variables: {
      filter: {
        id: { eq: publicUserId },
      },
    },
  });

  // query to check if the user is following the profile
  const { data: followsData, refetch: refetchFollows } = useGetFollowsQuery({
    variables: {
      filter: {
        follower_user_id: { eq: user?.id },
        followee_user_id: { eq: publicUserId },
      },
    },
  });

  // query to get number of followers
  const { data: followersData, refetch: refetchFollowers } = useGetFollowsQuery(
    {
      variables: {
        filter: {
          followee_user_id: { eq: publicUserId },
        },
      },
    },
  );

  // query to get number of followings
  const { data: followingsData, refetch: refetchFollowings } =
    useGetFollowsQuery({
      variables: {
        filter: {
          follower_user_id: { eq: publicUserId },
        },
      },
    });

  const [removeFollowing, { loading: loadingUnfollow }] =
    useRemoveFollowsMutation();
  const [addFollowing, { loading: loadingFollow }] = useCreateFollowsMutation();
  const [addBlockedUsers] = useCreateBlockedUsersMutation();

  const isFollowing = useMemo(
    () => !!followsData?.followsCollection?.edges?.length,
    [followsData?.followsCollection?.edges?.length],
  );

  const isProfileMyFollower = useMemo(
    () =>
      followersData?.followsCollection?.edges?.some(
        (follower) => follower?.node?.followee_user?.id === user?.id,
      ),
    [followersData?.followsCollection?.edges, user?.id],
  );

  const followersCount = useMemo(
    () => followersData?.followsCollection?.edges?.length?.toString() ?? '0',
    [followersData?.followsCollection?.edges?.length],
  );

  const followingsCount = useMemo(
    () => followingsData?.followsCollection?.edges?.length?.toString() ?? '0',
    [followingsData?.followsCollection?.edges?.length],
  );

  const profile = useMemo(() => {
    return data?.profilesCollection?.edges?.[0]?.node;
  }, [data]);

  const [isContextMenuVisible, setIsContextMenuVisible] =
    useState<boolean>(false);

  const dotsRef = useRef<View>(null);

  const handleContextMenuPress = useCallback(() => {
    setIsContextMenuVisible(true);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
  }, []);

  const handleUnfollow = useCallback(() => {
    removeFollowing({
      variables: {
        filter: {
          followee_user_id: { eq: publicUserId },
          follower_user_id: { eq: user?.id },
        },
      },
      onCompleted: ({ deleteFromfollowsCollection }) => {
        if (deleteFromfollowsCollection?.records?.length) {
          refetchFollows();
          refetchFollowers();
          refetchFollowings();
        }
      },
      onError: () => {
        Alert.alert('Error', 'Failed to unfollow user');
      },
    });

    handleCloseContextMenu();
  }, [
    handleCloseContextMenu,
    refetchFollowers,
    refetchFollowings,
    refetchFollows,
    removeFollowing,
    user?.id,
    publicUserId,
  ]);

  const handleFollow = useCallback(() => {
    addFollowing({
      variables: {
        objects: [
          { follower_user_id: user?.id, followee_user_id: publicUserId },
        ],
      },
      onCompleted: ({ insertIntofollowsCollection }) => {
        if (insertIntofollowsCollection?.records?.length) {
          refetchFollows();
          refetchFollowers();
          refetchFollowings();
        }
      },
      onError: () => {
        Alert.alert('Error', 'Failed to follow user');
      },
    });
  }, [
    addFollowing,
    refetchFollowers,
    refetchFollowings,
    refetchFollows,
    user?.id,
    publicUserId,
  ]);

  const handleBlock = useCallback(() => {
    addBlockedUsers({
      variables: {
        objects: [
          {
            blocker_user_id: user?.id,
            blocked_user_id: publicUserId,
          },
        ],
      },
      onCompleted: ({ insertIntoblocked_usersCollection }) => {
        if (insertIntoblocked_usersCollection?.records?.length) {
          handleCloseContextMenu();
          Alert.alert('Blocked', 'User blocked successfully');
        }
      },
    });
  }, [addBlockedUsers, user?.id, publicUserId, handleCloseContextMenu]);

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
            imageUrl={profile?.profile_image_url ?? ''}
          />
          <View className={classes.profileInfoContainer}>
            <Label variant="title" className={classes.profileName}>
              {profile?.username}
            </Label>
          </View>
        </View>

        <View className={classes.profileStatsContainer}>
          <ProfileStat title="Listing" value="5" />
          <Divider />
          <ProfileStat
            title="Followers"
            value={followersCount}
            onPress={() =>
              router.push(`/screens/followers?publicUserId=${publicUserId}`)
            }
          />
          <Divider />
          <ProfileStat
            title="Following"
            value={followingsCount}
            onPress={() =>
              router.push(`/screens/followings?publicUserId=${publicUserId}`)
            }
          />
        </View>
        <Row className={classes.buttonContainer}>
          <Button
            iconVariant="SimpleLineIcons"
            icon={isFollowing ? 'user-following' : 'user-follow'}
            className={classes.button}
            onPress={isFollowing ? handleUnfollow : handleFollow}
            disabled={loadingFollow || loadingUnfollow}
            loading={loadingFollow || loadingUnfollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          <Button
            variant="light"
            icon="message-processing-outline"
            className={classes.button}
            onPress={() => router.push(`/screens/chat?userId=${publicUserId}`)}
          >
            Message
          </Button>
        </Row>
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

      <ContextMenu
        visible={isContextMenuVisible}
        onClose={handleCloseContextMenu}
        triggerRef={dotsRef}
        menuHeight={60}
      >
        {isProfileMyFollower && (
          <>
            <TouchableOpacity onPress={handleUnfollow}>
              <Label className={classes.unfollowText}>
                Remove from followers
              </Label>
            </TouchableOpacity>
            <Divider position="horizontal" />
          </>
        )}
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
  blockText: '!text-red-600 text-md font-medium',
  unfollowText: '!text-slate-600 text-md font-medium',
};
