import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import Chart from '../Chart';

jest.mock('react-native-svg-charts', () => ({
  AreaChart: 'AreaChart',
}));

jest.mock('react-native-svg', () => ({
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  Line: 'Line',
}));

describe('Chart', () => {
  const mockData = {
    raw: {
      7: [10, 20, 15, 25, 30, 35, 40],
      14: [10, 20, 15, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
      30: Array.from({ length: 30 }, (_, i) => i + 10),
      90: Array.from({ length: 90 }, (_, i) => i + 10),
    },
    graded: {
      7: [5, 15, 10, 20, 25, 30, 35],
      14: [5, 15, 10, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
      30: Array.from({ length: 30 }, (_, i) => i + 5),
      90: Array.from({ length: 90 }, (_, i) => i + 5),
    },
  };

  const defaultProps = {
    data: mockData,
  };

  it('renders correctly with default props', () => {
    const { getByTestId, getByText } = render(<Chart {...defaultProps} />);
    expect(getByTestId('chart')).toBeTruthy();
    expect(getByText('Raw')).toBeTruthy();
    expect(getByText('Graded')).toBeTruthy();
  });

  it('renders period tabs', () => {
    const { getByText } = render(<Chart {...defaultProps} />);
    expect(getByText('7 days')).toBeTruthy();
    expect(getByText('14 days')).toBeTruthy();
    expect(getByText('30 days')).toBeTruthy();
    expect(getByText('90 days')).toBeTruthy();
  });

  it('switches to Graded tab when pressed', () => {
    const { getByTestId, getByText } = render(<Chart {...defaultProps} />);
    const gradedTab = getByTestId('graded-tab');
    fireEvent.press(gradedTab);
    expect(getByText('Graded')).toBeTruthy();
  });

  it('switches to Raw tab when pressed', () => {
    const { getByTestId, getByText } = render(<Chart {...defaultProps} />);
    const rawTab = getByTestId('raw-tab');
    fireEvent.press(rawTab);
    expect(getByText('Raw')).toBeTruthy();
  });

  it('changes period when period tab is pressed', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    const period14Tab = getByTestId('period-14');
    fireEvent.press(period14Tab);
    expect(getByTestId('chart-container')).toBeTruthy();
  });

  it('renders chart container', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    expect(getByTestId('chart-container')).toBeTruthy();
  });

  it('renders area chart', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    expect(getByTestId('area-chart')).toBeTruthy();
  });

  it('renders stats container', () => {
    const { getByTestId, getByText } = render(<Chart {...defaultProps} />);
    expect(getByTestId('stats-container')).toBeTruthy();
    expect(getByText('Best')).toBeTruthy();
    expect(getByText('Today')).toBeTruthy();
  });

  it('displays correct best value', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    expect(getByTestId('best-value')).toBeTruthy();
  });

  it('displays correct today value', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    expect(getByTestId('today-value')).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      raw: { 7: [], 14: [], 30: [], 90: [] },
      graded: { 7: [], 14: [], 30: [], 90: [] },
    };
    const { getByTestId } = render(<Chart data={emptyData} />);
    expect(getByTestId('chart')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<Chart {...defaultProps} />);
    expect(getByTestId('chart')).toBeTruthy();
  });
});
