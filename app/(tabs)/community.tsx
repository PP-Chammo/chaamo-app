import { useCallback, useMemo } from 'react';

import { router, useFocusEffect } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header, PostCard } from '@/components/molecules';
import { EventList } from '@/components/organisms';
import {
  useCreateBlockedUsersMutation,
  useCreatePostLikesMutation,
  useGetVwUserPostsLazyQuery,
  useRemovePostLikesMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function CommunityScreen() {
  const [user] = useUserVar();
  const [getPosts, { data, refetch }] = useGetVwUserPostsLazyQuery({
    fetchPolicy: 'cache-and-network',
  });
  const [addBlockedUsers] = useCreateBlockedUsersMutation();
  const [createPostLikes] = useCreatePostLikesMutation();
  const [removePostLikes] = useRemovePostLikesMutation();

  useFocusEffect(
    useCallback(() => {
      getPosts();
    }, [getPosts]),
  );

  const posts = useMemo(
    () => data?.vw_user_postsCollection?.edges ?? [],
    [data?.vw_user_postsCollection?.edges],
  );

  const handleComment = useCallback(() => {}, []);

  const handleTogglePostLike = useCallback(
    (post_id: string, liked: boolean) => () => {
      if (liked) {
        return removePostLikes({
          variables: {
            filter: {
              post_id: { eq: post_id },
              user_id: { eq: user.id },
            },
          },
          onCompleted: () => {
            refetch();
          },
        });
      }
      return createPostLikes({
        variables: {
          objects: [
            {
              post_id,
              user_id: user.id,
            },
          ],
        },
        onCompleted: () => {
          refetch();
        },
      });
    },
    [createPostLikes, user.id, refetch, removePostLikes],
  );

  const handleBlock = useCallback(
    (userId: string) => () => {
      addBlockedUsers({
        variables: {
          objects: [
            {
              blocker_user_id: user.id,
              blocked_user_id: userId,
            },
          ],
        },
        onCompleted: ({ insertIntoblocked_usersCollection }) => {
          if (insertIntoblocked_usersCollection?.records?.length) {
            Alert.alert('Blocked', 'User blocked successfully');
            refetch();
          }
        },
      });
    },
    [addBlockedUsers, user.id, refetch],
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Community"
        onBackPress={() => router.back()}
        rightIcon="plus-circle"
        rightIconColor={getColor('primary-500')}
        rightIconSize={28}
        onRightPress={() => router.push('/screens/new-post')}
        className={classes.header}
      />
      <ScrollView
        contentContainerClassName={classes.container}
        showsVerticalScrollIndicator={false}
      >
        <EventList />
        {posts.map((post) => (
          <PostCard
            showContext={post.node?.user_id !== user.id}
            key={post.node.id}
            postId={post.node?.id ?? ''}
            userId={post.node?.user_id ?? ''}
            username={post.node?.username ?? ''}
            userImageUrl={post.node?.profile_image_url ?? ''}
            contentImageUrl={post.node?.content_image_url ?? ''}
            content={post.node?.content ?? ''}
            createdAt={post.node?.created_at ?? ''}
            likeCount={post.node?.like_count ?? 0}
            liked={post.node?.liked ?? false}
            onCommentPress={handleComment}
            onLikePress={handleTogglePostLike(
              post.node.id,
              post.node?.liked ?? false,
            )}
            onBlockPress={handleBlock(post.node?.user_id ?? '')}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  container: 'gap-4',
  header: 'bg-white',
  containerEvents: 'flex flex-row gap-3 px-4.5',
  eventContainer: 'pt-4.5',
};
