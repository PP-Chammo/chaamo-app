import React from 'react';

import { render } from '@testing-library/react-native';

import StatsProfile from '../StatsProfile';

describe('StatsProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<StatsProfile />);
    expect(getByTestId('stats-profile')).toBeTruthy();
  });

  it('displays portfolio listings stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Portfolio Listings')).toBeTruthy();
  });

  it('displays sold items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Sold Items')).toBeTruthy();
  });

  it('displays auction items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Auction Items')).toBeTruthy();
  });

  it('displays buy now items stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Buy Now Items')).toBeTruthy();
  });

  it('displays total earnings stat', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Total Earnings')).toBeTruthy();
  });

  it('displays all stat values correctly', () => {
    const { getAllByText } = render(<StatsProfile />);
    expect(getAllByText('5')).toHaveLength(5);
  });

  it('displays location information', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('Location')).toBeTruthy();
    expect(getByText('London, UK')).toBeTruthy();
  });

  it('displays member since information', () => {
    const { getByText } = render(<StatsProfile />);
    expect(getByText('member since: jan 12, 2019')).toBeTruthy();
  });

  it('renders location icon', () => {
    const { getByTestId } = render(<StatsProfile />);
    expect(getByTestId('location-icon')).toBeTruthy();
  });
});
