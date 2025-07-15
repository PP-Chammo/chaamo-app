import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import SearchHistoryList from '../SearchHistoryList';

jest.mock('expo-router', () => ({
  Link: (props: Record<string, unknown>) => {
    return jest
      .requireActual('react')
      .createElement(
        jest.requireActual('react-native').TouchableOpacity,
        { ...props, testID: 'clear-all-link' },
        props.children,
      );
  },
}));

const mockList = ['apple', 'banana', 'cherry'];

describe('SearchHistoryList', () => {
  const onRemovePress = jest.fn();
  const onClearAllPress = jest.fn();
  const onHistoryPress = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <SearchHistoryList
        list={mockList}
        onRemovePress={onRemovePress}
        onClearAllPress={onClearAllPress}
        onHistoryPress={onHistoryPress}
      />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all search history items', () => {
    const { getAllByText } = render(
      <SearchHistoryList
        list={mockList}
        onRemovePress={onRemovePress}
        onClearAllPress={onClearAllPress}
        onHistoryPress={onHistoryPress}
      />,
    );
    mockList.forEach((item) => {
      expect(getAllByText(item).length).toBeGreaterThan(0);
    });
  });

  it('calls onHistoryPress when a search item is pressed', () => {
    const { getByText } = render(
      <SearchHistoryList
        list={mockList}
        onRemovePress={onRemovePress}
        onClearAllPress={onClearAllPress}
        onHistoryPress={onHistoryPress}
      />,
    );
    fireEvent.press(getByText('apple'));
    expect(onHistoryPress).toHaveBeenCalledWith('apple');
  });

  it('calls onRemovePress when remove icon is pressed', () => {
    const { getAllByText } = render(
      <SearchHistoryList
        list={mockList}
        onRemovePress={onRemovePress}
        onClearAllPress={onClearAllPress}
        onHistoryPress={onHistoryPress}
      />,
    );
    const removeIcons = getAllByText('×');
    fireEvent.press(removeIcons[1]);
    expect(onRemovePress).toHaveBeenCalled();
  });

  it('calls onClearAllPress when clear all is pressed', () => {
    const { getByTestId } = render(
      <SearchHistoryList
        list={mockList}
        onRemovePress={onRemovePress}
        onClearAllPress={onClearAllPress}
        onHistoryPress={onHistoryPress}
      />,
    );
    fireEvent.press(getByTestId('clear-all-link'));
    expect(onClearAllPress).toHaveBeenCalled();
  });
});
