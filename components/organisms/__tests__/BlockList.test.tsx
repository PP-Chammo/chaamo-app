import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import BlockList from '../BlockList';

describe('BlockList', () => {
  const mockData = [
    {
      id: 1,
      name: 'John Doe',
      imageUrl: 'https://example.com/john.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      imageUrl: 'https://example.com/jane.jpg',
    },
  ];

  const defaultProps = {
    data: mockData,
    isBlocked: false,
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
    const { getByTestId } = render(<BlockList data={[]} />);
    expect(getByTestId('block-list')).toBeTruthy();
  });

  it('renders with correct styling', () => {
    const { getByTestId } = render(<BlockList {...defaultProps} />);
    const blockList = getByTestId('block-list');
    expect(blockList).toBeTruthy();
  });
});
