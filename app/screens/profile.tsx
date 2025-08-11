import { useCallback, useMemo, useRef, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import pluralize from 'pluralize';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Divider,
  Icon,
  Label,
  Loading,
  ProfileStat,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, Lazy, TabView } from '@/components/molecules';
import { profileTabs } from '@/constants/tabs';
import {
  useCreateFollowsMutation,
  useRemoveFollowsMutation,
  useCreateBlockedUsersMutation,
  useRemoveBlockedUsersMutation,
  useGetProfilesQuery,
} from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useFollows } from '@/hooks/useFollows';
import { useRealtime } from '@/hooks/useRealtime';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ProfileScreen() {
  useRealtime(['follows', 'blocked_users']);
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { getIsBlocked } = useBlockedUsers();
  const { followers, followings, getIsFollowing, getIsFollower } = useFollows(
    userId as string,
  );

  const { data } = useGetProfilesQuery({
    variables: {
      filter: {
        id: { eq: userId || user?.id },
      },
    },
  });
  const [removeFollow, { loading: loadingUnfollow }] =
    useRemoveFollowsMutation();
  const [createFollow, { loading: loadingFollow }] = useCreateFollowsMutation();
  const [createBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeBlockedUsers] = useRemoveBlockedUsersMutation();

  const dotsRef = useRef<View>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const isSelf = useMemo(() => {
    if (!userId) {
      return true;
    }
    return user?.id === userId;
  }, [user?.id, userId]);

  const profile = useMemo(() => {
    return data?.profilesCollection?.edges?.[0]?.node;
  }, [data?.profilesCollection?.edges]);

  const handleSettingsPress = useCallback(() => {
    if (isSelf) {
      return router.push('/screens/settings');
    }
    setIsContextMenuVisible(true);
  }, [isSelf]);

  const handleEditProfilePress = useCallback(() => {
    router.push('/screens/personal-details');
  }, []);

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      if (getIsFollowing(followeeUserId)) {
        removeFollow({
          variables: {
            filter: {
              follower_user_id: { eq: user?.id },
              followee_user_id: { eq: followeeUserId },
            },
          },
        });
      } else {
        createFollow({
          variables: {
            objects: [
              {
                follower_user_id: user?.id,
                followee_user_id: followeeUserId,
              },
            ],
          },
        });
      }
    },
    [getIsFollowing, createFollow, removeFollow, user?.id],
  );

  const handleRemoveFromFollower = useCallback(
    (followerUserId: string) => () => {
      removeFollow({
        variables: {
          filter: {
            follower_user_id: { eq: followerUserId },
            followee_user_id: { eq: user?.id },
          },
        },
      });
    },
    [removeFollow, user?.id],
  );

  const handleToggleBlockedUser = useCallback(() => {
    if (getIsBlocked(userId as string)) {
      removeBlockedUsers({
        variables: {
          filter: {
            blocker_user_id: { eq: user?.id },
            blocked_user_id: { eq: userId },
          },
        },
        onCompleted: ({ deleteFromblocked_usersCollection }) => {
          if (deleteFromblocked_usersCollection?.records?.length) {
            setIsContextMenuVisible(false);
          }
        },
      });
    } else {
      createBlockedUsers({
        variables: {
          objects: [
            {
              blocker_user_id: user?.id,
              blocked_user_id: userId,
            },
          ],
        },
        onCompleted: ({ insertIntoblocked_usersCollection }) => {
          if (insertIntoblocked_usersCollection?.records?.length) {
            setIsContextMenuVisible(false);
            removeFollow({
              variables: {
                filter: {
                  follower_user_id: { eq: user?.id },
                  followee_user_id: { eq: userId },
                },
              },
            });
            Alert.alert('Blocked', 'User blocked successfully');
          }
        },
      });
    }
  }, [
    getIsBlocked,
    userId,
    removeBlockedUsers,
    user?.id,
    createBlockedUsers,
    removeFollow,
  ]);

  return (
    <>
      <ScreenContainer className={classes.container}>
        <Header
          title={
            isSelf
              ? 'Profile'
              : `${profile?.username.split(' ')?.[0]}'s Profile`
          }
          rightIcon={isSelf ? 'menu' : 'dots-vertical'}
          onBackPress={isSelf ? undefined : () => router.back()}
          onRightPress={handleSettingsPress}
          rightRef={dotsRef}
        />
        <View className={classes.profileContainer}>
          <Avatar size="lg" imageUrl={profile?.profile_image_url ?? ''} />
          <View className={classes.profileInfoContainer}>
            <Label variant="title" className={classes.profileName}>
              {profile?.username}
            </Label>
            {isSelf && (
              <View className={classes.portfolioContainer}>
                <Label className={classes.portfolioValueLabel}>
                  Portfolio Value:
                </Label>
                <TouchableOpacity
                  onPress={() => router.push('/screens/portfolio-value')}
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
            )}
          </View>
        </View>

        <View className={classes.profileStatsContainer}>
          <ProfileStat title="Listing" value="-" />
          <Divider />
          <ProfileStat
            title={pluralize('Followers', Number(followers.length))}
            value={String(followers.length)}
            onPress={() =>
              router.push({
                pathname: '/screens/followers',
                params: {
                  userId,
                },
              })
            }
          />
          <Divider />
          <ProfileStat
            title={pluralize('Following', Number(followings.length))}
            value={String(followings.length)}
            onPress={() =>
              router.push({
                pathname: '/screens/followings',
                params: {
                  userId,
                },
              })
            }
          />
        </View>

        {isSelf ? (
          <Button
            icon="pencil-outline"
            className={classes.editProfileButton}
            onPress={handleEditProfilePress}
          >
            Edit Profile
          </Button>
        ) : (
          <Row className={classes.buttonContainer}>
            {getIsBlocked(userId as string) ? (
              <Button
                iconVariant="Ionicons"
                icon="ban-outline"
                variant="danger-light"
                className={classes.button}
                onPress={handleToggleBlockedUser}
                disabled={loadingFollow || loadingUnfollow}
                loading={loadingFollow || loadingUnfollow}
              >
                Unblock
              </Button>
            ) : (
              <>
                <Button
                  iconVariant="SimpleLineIcons"
                  icon={
                    getIsFollowing(userId as string)
                      ? 'user-following'
                      : 'user-follow'
                  }
                  className={classes.button}
                  onPress={handleToggleFollow(userId as string)}
                  disabled={loadingFollow || loadingUnfollow}
                  loading={loadingFollow || loadingUnfollow}
                >
                  {getIsFollowing(userId as string) ? 'Unfollow' : 'Follow'}
                </Button>
                <Button
                  variant="light"
                  icon="message-processing-outline"
                  className={classes.button}
                  onPress={() =>
                    router.push({
                      pathname: '/screens/chat',
                      params: {
                        userId,
                      },
                    })
                  }
                >
                  Message
                </Button>
              </>
            )}
          </Row>
        )}
        <TabView className={classes.tabView} tabs={profileTabs}>
          <Lazy
            load={() => import('@/components/organisms/PortfolioProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/SoldItemsProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/StatsProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/ReviewsProfile')}
            fallback={<Loading />}
          />
        </TabView>
      </ScreenContainer>
      {!isSelf && (
        <ContextMenu
          visible={isContextMenuVisible}
          onClose={() => setIsContextMenuVisible(false)}
          triggerRef={dotsRef}
          menuHeight={60}
        >
          {getIsFollower(userId as string) && (
            <>
              <TouchableOpacity
                onPress={handleRemoveFromFollower(userId as string)}
              >
                <Label className={classes.unfollowText}>
                  Remove from followers
                </Label>
              </TouchableOpacity>
              <Divider position="horizontal" />
            </>
          )}
          <TouchableOpacity onPress={handleToggleBlockedUser}>
            <Label className={classes.blockText}>
              {getIsBlocked(userId as string) ? 'Unblock' : 'Block'}
            </Label>
          </TouchableOpacity>
        </ContextMenu>
      )}
    </>
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
  buttonContainer: 'gap-4 px-4.5',
  button: 'flex-1',
  blockText: '!text-red-600 text-md font-medium',
  unfollowText: '!text-slate-600 text-md font-medium',
};
