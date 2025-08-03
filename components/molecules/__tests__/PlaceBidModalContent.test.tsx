import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import PlaceBidModalContent from '../PlaceBidModalContent';

describe('PlaceBidModalContent', () => {
  const defaultProps = {
    id: 'test-id',
    endDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000,
    ).toISOString(),
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and time', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
    expect(screen.getByText(/7d \d+h/)).toBeTruthy();
  });

  it('displays current bid information', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getByText('Current Bid: $4000')).toBeTruthy();
  });

  it('displays max bid input field', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getByText('Max Bid')).toBeTruthy();
    expect(screen.getByDisplayValue('$ 5000')).toBeTruthy();
  });

  it('displays quick bid options', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.getByText('$200')).toBeTruthy();
    expect(screen.getByText('$300')).toBeTruthy();
  });

  it('allows changing bid amount through input', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    const input = screen.getByDisplayValue('$ 5000');
    fireEvent.changeText(input, '8000');

    expect(screen.getByDisplayValue('$ 8000')).toBeTruthy();
  });

  it('allows selecting quick bid options', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    const quickBid200 = screen.getByText('$200');
    fireEvent.press(quickBid200);

    expect(screen.getByDisplayValue('$ 200')).toBeTruthy();
  });

  it('displays place bid button', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
  });

  it('displays note about minimum threshold', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getByText(/Note:/)).toBeTruthy();
    expect(screen.getByText(/The minimum threshold/)).toBeTruthy();
    expect(screen.getByText(/\$2000/)).toBeTruthy();
  });

  it('filters non-numeric input from bid field', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    const input = screen.getByDisplayValue('$ 5000');
    fireEvent.changeText(input, 'abc123def');

    expect(screen.getByDisplayValue('$ 123')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
    expect(screen.getByText(/7d \d+h/)).toBeTruthy();
    expect(screen.getByText('Max Bid')).toBeTruthy();
    expect(screen.getByText('Current Bid: $4000')).toBeTruthy();
  });

  it('handles quick bid selection correctly', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    expect(screen.getByDisplayValue('$ 5000')).toBeTruthy();

    const quickBid300 = screen.getByText('$300');
    fireEvent.press(quickBid300);

    expect(screen.getByDisplayValue('$ 300')).toBeTruthy();
  });

  it('maintains selected state for quick bid buttons', () => {
    render(<PlaceBidModalContent {...defaultProps} />);

    const quickBid200 = screen.getByText('$200');
    fireEvent.press(quickBid200);

    expect(screen.getByDisplayValue('$ 200')).toBeTruthy();
  });
});
