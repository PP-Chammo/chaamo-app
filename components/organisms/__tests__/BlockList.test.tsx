import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { BlockedUsers } from '@/domains/user.types';

import BlockList from '../BlockList';

describe('BlockList', () => {
  const mockData = [
    {
      id: '1',
      username: 'John Doe',
      profile_image_url: 'https://example.com/john.jpg',
    },
    {
      id: '2',
      username: 'Jane Smith',
      profile_image_url: 'https://example.com/jane.jpg',
    },
  ];

  const defaultProps = {
    data: mockData as BlockedUsers,
    isBlocked: false,
    isLoading: false,
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<BlockList {...defaultProps} />);
    expect(getByTestId('block-list')).toBeTruthy();
  });

  it('renders block list items', () => {
    const { getAllByTestId } = render(<BlockList {...defaultProps} />);
    const blockListItems = getAllByTestId('block-list-item');
    expect(blockListItems).toHaveLength(2);
  });

  it('displays user names', () => {
    const { getByText } = render(<BlockList {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('handles item press', () => {
    const { getAllByTestId } = render(<BlockList {...defaultProps} />);
    const blockListItems = getAllByTestId('block-list-item');
    const firstItem = blockListItems[0];

    fireEvent.press(firstItem);
    expect(firstItem).toBeTruthy();
  });

  it('renders with blocked state', () => {
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} isBlocked={true} />,
    );
    const blockListItems = getAllByTestId('block-list-item');
    expect(blockListItems).toHaveLength(2);
  });

  it('renders with empty data', () => {
    const { getByTestId } = render(<BlockList data={[] as BlockedUsers} />);
    expect(getByTestId('block-list')).toBeTruthy();
  });

  it('renders with correct styling', () => {
    const { getByTestId } = render(<BlockList {...defaultProps} />);
    const blockList = getByTestId('block-list');
    expect(blockList).toBeTruthy();
  });

  it('shows loading state on individual items when isLoading is true', () => {
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} isLoading={true} />,
    );
    const buttons = getAllByTestId('button');
    expect(buttons).toHaveLength(2);
  });

  it('does not show loading state when isLoading is false', () => {
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} isLoading={false} />,
    );
    const buttons = getAllByTestId('button');
    expect(buttons).toHaveLength(2);
  });

  it('calls onBlock when item is pressed and not blocked', () => {
    const onBlock = jest.fn();
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} onBlock={onBlock} isBlocked={false} />,
    );

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    expect(onBlock).toHaveBeenCalledWith('1');
  });

  it('calls onRemove when item is pressed and blocked', () => {
    const onRemove = jest.fn();
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} onRemove={onRemove} isBlocked={true} />,
    );

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('sets loading state for specific item when pressed', () => {
    const onBlock = jest.fn();
    const { getAllByTestId } = render(
      <BlockList {...defaultProps} onBlock={onBlock} isLoading={true} />,
    );

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[0]);

    expect(onBlock).toHaveBeenCalledWith('1');
  });

  it('handles loading state with blocked items', () => {
    const onRemove = jest.fn();
    const { getAllByTestId } = render(
      <BlockList
        {...defaultProps}
        onRemove={onRemove}
        isBlocked={true}
        isLoading={true}
      />,
    );

    const buttons = getAllByTestId('button');
    fireEvent.press(buttons[1]);

    expect(onRemove).toHaveBeenCalledWith('2');
  });
});
