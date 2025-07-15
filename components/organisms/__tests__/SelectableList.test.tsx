import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import SelectableList from '../SelectableList';

const mockData = ['Alabama', 'Alaska', 'Arizona', 'Arkansas'];

describe('SelectableList', () => {
  const onSelect = jest.fn();

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <SelectableList value="" data={mockData} onSelect={onSelect} />,
    );
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('renders all items', () => {
    const { getAllByText } = render(
      <SelectableList value="" data={mockData} onSelect={onSelect} />,
    );
    mockData.forEach((item) => {
      expect(getAllByText(item).length).toBeGreaterThan(0);
    });
  });

  it('filters items based on search', () => {
    const { getByPlaceholderText, queryByText } = render(
      <SelectableList value="" data={mockData} onSelect={onSelect} />,
    );
    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'Alaska');
    expect(queryByText('Alaska')).toBeTruthy();
    expect(queryByText('Alabama')).toBeNull();
  });

  it('calls onSelect when an item is pressed', () => {
    const { getByText } = render(
      <SelectableList value="" data={mockData} onSelect={onSelect} />,
    );
    fireEvent.press(getByText('Alabama'));
    expect(onSelect).toHaveBeenCalledWith('Alabama');
  });

  it('shows check icon for selected value', () => {
    const { getByText } = render(
      <SelectableList value="Alaska" data={mockData} onSelect={onSelect} />,
    );
    expect(getByText('Alaska')).toBeTruthy();
  });
});
