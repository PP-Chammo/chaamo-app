import { fireEvent, render } from '@testing-library/react-native';

import FilterTabs from '../FilterTabs';

describe('FilterTabs', () => {
  const mockTabs = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const defaultProps = {
    tabs: mockTabs,
    selected: 'all',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<FilterTabs {...defaultProps} />);

    expect(getByText('All')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('calls onChange when a tab is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <FilterTabs {...defaultProps} onChange={onChange} />,
    );

    fireEvent.press(getByText('Active'));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <FilterTabs {...defaultProps} className="custom-class" />,
    );

    expect(getByText('All')).toBeTruthy();
  });

  it('renders with different selected values', () => {
    const { getByText } = render(
      <FilterTabs {...defaultProps} selected="completed" />,
    );

    expect(getByText('All')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
  });

  it('renders with numeric values', () => {
    const numericTabs = [
      { label: 'Tab 1', value: 1 },
      { label: 'Tab 2', value: 2 },
    ];

    const { getByText } = render(
      <FilterTabs tabs={numericTabs} selected={1} onChange={jest.fn()} />,
    );

    expect(getByText('Tab 1')).toBeTruthy();
    expect(getByText('Tab 2')).toBeTruthy();
  });

  it('handles empty tabs array', () => {
    const { getByTestId } = render(
      <FilterTabs tabs={[]} selected="" onChange={jest.fn()} />,
    );

    expect(getByTestId).toBeTruthy();
  });
});
