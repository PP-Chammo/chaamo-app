import { memo } from 'react';

import { EventCard, ListContainer } from '@/components/molecules';
import { dummyEvents } from '@/constants/dummy';

const EventList = memo(function EventList() {
  return (
    <ListContainer
      title="Upcoming Events"
      noLink
      data={dummyEvents}
      className={classes.eventContainer}
    >
      {(event: (typeof dummyEvents)[number]) => (
        <EventCard
          title={event.title}
          date={event.date}
          location={event?.location}
          imageUrl={event?.imageUrl}
        />
      )}
    </ListContainer>
  );
});

const classes = {
  eventContainer: 'pt-4.5',
};

export default EventList;
