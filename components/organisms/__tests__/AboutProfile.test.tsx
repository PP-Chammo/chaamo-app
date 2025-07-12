import React from 'react';

import { render } from '@testing-library/react-native';

import AboutProfile from '../AboutProfile';

describe('AboutProfile', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AboutProfile />);
    expect(getByTestId('about-profile')).toBeTruthy();
  });

  it('displays portfolio listings stat', () => {
    const { getByText, getAllByText } = render(<AboutProfile />);
    expect(getByText('Portfolio Listings')).toBeTruthy();
    expect(getAllByText('5')).toHaveLength(4); // There are 4 stats with value "5"
  });

  it('displays sold items stat', () => {
    const { getByText } = render(<AboutProfile />);
    expect(getByText('Sold Items')).toBeTruthy();
  });

  it('displays followers stat', () => {
    const { getByText } = render(<AboutProfile />);
    expect(getByText('Followers')).toBeTruthy();
  });

  it('displays following stat', () => {
    const { getByText } = render(<AboutProfile />);
    expect(getByText('Following')).toBeTruthy();
  });

  it('displays location information', () => {
    const { getByText } = render(<AboutProfile />);
    expect(getByText('Location')).toBeTruthy();
    expect(getByText('London, UK')).toBeTruthy();
  });

  it('displays member since information', () => {
    const { getByText } = render(<AboutProfile />);
    expect(getByText('member since: jan 12, 2019')).toBeTruthy();
  });

  it('renders location icon', () => {
    const { getByTestId } = render(<AboutProfile />);
    expect(getByTestId('location-icon')).toBeTruthy();
  });
});
