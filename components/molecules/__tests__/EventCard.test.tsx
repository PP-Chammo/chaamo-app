import React from 'react';

import { render } from '@testing-library/react-native';

import EventCard from '../EventCard';

describe('EventCard', () => {
  const defaultProps = {
    title: 'Tech Conference 2024',
    date: 'March 15, 2024',
    location: 'San Francisco, CA',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<EventCard {...defaultProps} />);
    expect(getByText('Tech Conference 2024')).toBeTruthy();
    expect(getByText('March 15, 2024')).toBeTruthy();
    expect(getByText('San Francisco, CA')).toBeTruthy();
  });

  it('renders with image URL', () => {
    const { getByTestId } = render(
      <EventCard {...defaultProps} imageUrl="https://example.com/event.jpg" />,
    );
    expect(getByTestId('event-image')).toBeTruthy();
  });

  it('renders placeholder when no image URL is provided', () => {
    const { getByTestId } = render(<EventCard {...defaultProps} />);
    expect(getByTestId('event-placeholder')).toBeTruthy();
  });

  it('renders with null image URL', () => {
    const { getByTestId } = render(
      <EventCard {...defaultProps} imageUrl={null} />,
    );
    expect(getByTestId('event-placeholder')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(
      <EventCard {...defaultProps} title="Music Festival" />,
    );
    expect(getByText('Music Festival')).toBeTruthy();
  });

  it('renders with custom date', () => {
    const { getByText } = render(
      <EventCard {...defaultProps} date="December 25, 2024" />,
    );
    expect(getByText('December 25, 2024')).toBeTruthy();
  });

  it('renders with custom location', () => {
    const { getByText } = render(
      <EventCard {...defaultProps} location="New York, NY" />,
    );
    expect(getByText('New York, NY')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByText, getByTestId } = render(
      <EventCard
        title="Art Exhibition"
        date="April 10, 2024"
        location="Los Angeles, CA"
        imageUrl="https://example.com/art.jpg"
      />,
    );

    expect(getByText('Art Exhibition')).toBeTruthy();
    expect(getByText('April 10, 2024')).toBeTruthy();
    expect(getByText('Los Angeles, CA')).toBeTruthy();
    expect(getByTestId('event-image')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<EventCard {...defaultProps} />);
    expect(getByTestId('event-card')).toBeTruthy();
  });

  it('renders calendar icon', () => {
    const { getByTestId } = render(<EventCard {...defaultProps} />);
    expect(getByTestId('calendar-icon')).toBeTruthy();
  });

  it('renders location icon', () => {
    const { getByTestId } = render(<EventCard {...defaultProps} />);
    expect(getByTestId('location-icon')).toBeTruthy();
  });

  it('renders with long title', () => {
    const longTitle =
      'This is a very long event title that should still be displayed properly in the event card component';
    const { getByText } = render(
      <EventCard {...defaultProps} title={longTitle} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('renders with long location', () => {
    const longLocation =
      'This is a very long location name that should still be displayed properly';
    const { getByText } = render(
      <EventCard {...defaultProps} location={longLocation} />,
    );
    expect(getByText(longLocation)).toBeTruthy();
  });
});
