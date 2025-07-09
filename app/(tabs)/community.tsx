import { useCallback } from 'react';

import { router } from 'expo-router';
import { FlatList, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import {
  EventCard,
  GroupWithLink,
  Header,
  PostCard,
} from '@/components/molecules';
import { dummyEvents, dummyPosts } from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

export default function CommunityScreen() {
  const handleComment = useCallback(() => {}, []);
  const handleLike = useCallback(() => {}, []);
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Community"
        onBackPress={() => router.back()}
        iconRight="plus-circle"
        iconRightColor={getColor('teal-600')}
        iconRightSize={28}
        onRightPress={() => router.push('/screens/new-post')}
        className={classes.header}
      />
      <ScrollView
        contentContainerClassName={classes.container}
        showsVerticalScrollIndicator={false}
      >
        <GroupWithLink title="Upcoming Events" noLink>
          <FlatList
            data={dummyEvents}
            keyExtractor={(event) => event.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName={classes.containerEvents}
            renderItem={({ item: event }) => (
              <EventCard
                title={event.title}
                date={event.date}
                location={event.location}
                imageUrl={event?.image}
              />
            )}
          />
        </GroupWithLink>
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
};
