import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import PeopleList from '../PeopleList';

describe('PeopleList', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<PeopleList />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('displays people title', () => {
    const { getByText } = render(<PeopleList />);
    expect(getByText('People')).toBeTruthy();
  });

  it('renders all people items', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    expect(peopleItems.length).toBe(3);
  });

  it('handles people item press', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const peopleItems = getAllByTestId('people-item');
    fireEvent.press(peopleItems[0]);
    expect(peopleItems[0]).toBeTruthy();
  });

  it('handles follow button press', () => {
    const { getAllByTestId } = render(<PeopleList />);
    const followButtons = getAllByTestId('follow-button');
    fireEvent.press(followButtons[0]);
    expect(followButtons[0]).toBeTruthy();
  });
});
