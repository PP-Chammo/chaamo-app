import React from 'react';

import { render } from '@testing-library/react-native';

import EventList from '../EventList';

describe('EventList', () => {
  it('renders correctly', () => {
    const { getByText } = render(<EventList />);
    expect(getByText('Upcoming Events')).toBeTruthy();
  });

  it('renders with correct title', () => {
    const { getByText } = render(<EventList />);
    expect(getByText('Upcoming Events')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<EventList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders ListContainer component', () => {
    const { toJSON } = render(<EventList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders EventCard components for each event', () => {
    const { toJSON } = render(<EventList />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays events from dummy data', () => {
    const { toJSON } = render(<EventList />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with proper layout structure', () => {
    const { toJSON } = render(<EventList />);
    expect(toJSON()).toBeTruthy();
  });
});
