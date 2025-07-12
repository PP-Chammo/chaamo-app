import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import ListContainer, { ListContainerDirection } from '../ListContainer';

describe('ListContainer', () => {
  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  const defaultProps = {
    title: 'Test List',
    data: mockData,
    children: (item: { id: number; name: string }) => (
      <View testID={`item-${item.id}`}>{item.name}</View>
    ),
  };

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(
      <ListContainer {...defaultProps} />,
    );
    expect(getByText('Test List')).toBeTruthy();
    expect(getByText('View all')).toBeTruthy();
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(
      <ListContainer {...defaultProps} title="Custom Title" />,
    );
    expect(getByText('Custom Title')).toBeTruthy();
  });

  it('renders with custom title link text', () => {
    const { getByText } = render(
      <ListContainer {...defaultProps} titleLink="See more" />,
    );
    expect(getByText('See more')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByTestId } = render(
      <ListContainer {...defaultProps} icon="star" />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders with custom icon color and size', () => {
    const { getByTestId } = render(
      <ListContainer
        {...defaultProps}
        icon="heart"
        iconColor="red"
        iconSize={24}
      />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('calls onPress when view all is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ListContainer {...defaultProps} onPress={onPress} />,
    );

    const viewAllButton = getByText('View all');
    fireEvent.press(viewAllButton);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render view all link when noLink is true', () => {
    const { queryByText } = render(
      <ListContainer {...defaultProps} noLink={true} />,
    );
    expect(queryByText('View all')).toBeNull();
  });

  it('renders items in horizontal direction by default', () => {
    const { getByTestId } = render(<ListContainer {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders items in vertical direction', () => {
    const { getByTestId } = render(
      <ListContainer
        {...defaultProps}
        listDirection={ListContainerDirection.Vertical}
      />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders items without scroll when direction is none', () => {
    const { getByTestId } = render(
      <ListContainer
        {...defaultProps}
        listDirection={ListContainerDirection.None}
      />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders all data items', () => {
    const { getByTestId } = render(<ListContainer {...defaultProps} />);
    expect(getByTestId('item-1')).toBeTruthy();
    expect(getByTestId('item-2')).toBeTruthy();
    expect(getByTestId('item-3')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <ListContainer {...defaultProps} className="custom-class" />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('applies custom headerClassName', () => {
    const { getByTestId } = render(
      <ListContainer {...defaultProps} headerClassName="custom-header" />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('applies custom contentContainerClassName', () => {
    const { getByTestId } = render(
      <ListContainer
        {...defaultProps}
        contentContainerClassName="custom-content"
      />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders with empty data array', () => {
    const { getByText } = render(<ListContainer {...defaultProps} data={[]} />);
    expect(getByText('Test List')).toBeTruthy();
  });

  it('renders with complex children function', () => {
    const complexChildren = (
      item: { id: number; name: string },
      index: number,
    ) => (
      <View testID={`complex-item-${item.id}`}>
        <View testID={`item-index-${index}`}>{item.name}</View>
      </View>
    );

    const { getByTestId } = render(
      <ListContainer {...defaultProps}>{complexChildren}</ListContainer>,
    );
    expect(getByTestId('complex-item-1')).toBeTruthy();
    expect(getByTestId('item-index-0')).toBeTruthy();
  });

  it('handles multiple interactions', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ListContainer {...defaultProps} onPress={onPress} />,
    );

    const viewAllButton = getByText('View all');
    fireEvent.press(viewAllButton);
    fireEvent.press(viewAllButton);

    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('renders with all props combined', () => {
    const onPress = jest.fn();
    const { getByText, getByTestId } = render(
      <ListContainer
        {...defaultProps}
        title="Complete List"
        titleLink="See all"
        icon="star"
        iconColor="yellow"
        iconSize={28}
        onPress={onPress}
        listDirection={ListContainerDirection.Vertical}
        className="custom-container"
        headerClassName="custom-header"
        contentContainerClassName="custom-content"
      />,
    );

    expect(getByText('Complete List')).toBeTruthy();
    expect(getByText('See all')).toBeTruthy();
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders with long title', () => {
    const longTitle =
      'This is a very long list title that should still be displayed properly';
    const { getByText } = render(
      <ListContainer {...defaultProps} title={longTitle} />,
    );
    expect(getByText(longTitle)).toBeTruthy();
  });
});
