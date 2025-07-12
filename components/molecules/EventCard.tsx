import { memo } from 'react';

import { Image, TouchableOpacity, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';

type EventCardProps = {
  title: string;
  date: string;
  location: string;
  imageUrl?: string | null;
};

const EventCard: React.FC<EventCardProps> = memo(function EventCard({
  title,
  date,
  location,
  imageUrl,
}) {
  return (
    <TouchableOpacity
      testID="event-card"
      activeOpacity={0.5}
      className={classes.eventCard}
    >
      {imageUrl ? (
        <Image
          testID="event-image"
          source={{ uri: imageUrl }}
          className={classes.eventImage}
        />
      ) : (
        <View testID="event-placeholder" className={classes.eventImage} />
      )}
      <View className={classes.eventDetails}>
        <Label className={classes.eventTitle}>{title}</Label>
        <Row className={classes.rowLabel}>
          <Icon
            testID="calendar-icon"
            name="calendar"
            variant="SimpleLineIcons"
            size={10}
          />
          <Label className={classes.eventDate}>{date}</Label>
        </Row>
        <Row className={classes.rowLabel}>
          <Icon
            testID="location-icon"
            name="location-pin"
            variant="SimpleLineIcons"
            size={10}
          />
          <Label className={classes.eventLocation}>{location}</Label>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const classes = {
  eventCard: 'w-44 rounded-lg shadow gap-1.5',
  eventImage: 'w-full h-28 bg-gray-300 rounded-lg',
  eventDetails: 'p-1 gap-1',
  eventTitle: 'text-sm font-semibold',
  eventDate: 'text-xs !text-gray-700',
  eventLocation: 'text-xs !text-gray-700',
  rowLabel: 'gap-2',
};

export default EventCard;
