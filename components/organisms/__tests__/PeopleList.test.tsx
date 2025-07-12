import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { dummyDiscoverPeopleList } from '@/constants/dummy';

import PeopleList from '../PeopleList';

describe('PeopleList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<PeopleList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all people items', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    expect(peopleItems.length).toBe(dummyDiscoverPeopleList.length);
  });

  it('displays people title', () => {
    const { getByText } = render(<PeopleList />);
    expect(getByText('People')).toBeTruthy();
  });

  it('handles people item press', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    fireEvent.press(peopleItems[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/People pressed for card/),
    );
    consoleSpy.mockRestore();
  });

  it('handles follow button press', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getAllByTestId } = render(<PeopleList />);
    const followButtons = getAllByTestId('follow-button');
    fireEvent.press(followButtons[0]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Follow pressed for card/),
    );
    consoleSpy.mockRestore();
  });
});
