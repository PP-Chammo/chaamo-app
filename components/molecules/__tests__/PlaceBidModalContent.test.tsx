import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import PlaceBidModalContent from '../PlaceBidModalContent';

describe('PlaceBidModalContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and time', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
    expect(screen.getByText('7d 15h')).toBeTruthy();
  });

  it('displays current bid information', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getByText('Current Bid: $4000')).toBeTruthy();
  });

  it('displays max bid input field', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getByText('Max Bid')).toBeTruthy();
    expect(screen.getByDisplayValue('$5000')).toBeTruthy();
  });

  it('displays quick bid options', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getByText('$5000')).toBeTruthy();
    expect(screen.getByText('$6000')).toBeTruthy();
    expect(screen.getByText('$7000')).toBeTruthy();
  });

  it('allows changing bid amount through input', () => {
    render(<PlaceBidModalContent />);

    const input = screen.getByDisplayValue('$5000');
    fireEvent.changeText(input, '8000');

    expect(screen.getByDisplayValue('$8000')).toBeTruthy();
  });

  it('allows selecting quick bid options', () => {
    render(<PlaceBidModalContent />);

    const quickBid6000 = screen.getByText('$6000');
    fireEvent.press(quickBid6000);

    expect(screen.getByDisplayValue('$6000')).toBeTruthy();
  });

  it('displays place bid button', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
  });

  it('displays note about minimum threshold', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getByText(/Note:/)).toBeTruthy();
    expect(screen.getByText(/The minimum threshold/)).toBeTruthy();
    expect(screen.getByText(/\$2000/)).toBeTruthy();
  });

  it('filters non-numeric input from bid field', () => {
    render(<PlaceBidModalContent />);

    const input = screen.getByDisplayValue('$5000');
    fireEvent.changeText(input, 'abc123def');

    expect(screen.getByDisplayValue('$123')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getAllByText('Place Bid')).toHaveLength(2);
    expect(screen.getByText('7d 15h')).toBeTruthy();
    expect(screen.getByText('Max Bid')).toBeTruthy();
    expect(screen.getByText('Current Bid: $4000')).toBeTruthy();
  });

  it('handles quick bid selection correctly', () => {
    render(<PlaceBidModalContent />);

    expect(screen.getByDisplayValue('$5000')).toBeTruthy();

    const quickBid7000 = screen.getByText('$7000');
    fireEvent.press(quickBid7000);

    expect(screen.getByDisplayValue('$7000')).toBeTruthy();
  });

  it('maintains selected state for quick bid buttons', () => {
    render(<PlaceBidModalContent />);

    const quickBid6000 = screen.getByText('$6000');
    fireEvent.press(quickBid6000);

    expect(screen.getByDisplayValue('$6000')).toBeTruthy();
  });
});
