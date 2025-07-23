import { useCallback } from 'react';

import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { Header, PostCard } from '@/components/molecules';
import { EventList } from '@/components/organisms';
import { dummyPosts } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

export default function CommunityScreen() {
  const handleComment = useCallback(() => {}, []);
  const handleLike = useCallback(() => {}, []);
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
        {dummyPosts.map((post) => (
          <PostCard
            key={String(post.id)}
            post={post}
            onCommentPress={handleComment}
            onLikePress={handleLike}
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
