import React from 'react';

import { render } from '@testing-library/react-native';

import Review from '../Review';

describe('Review', () => {
  const defaultProps = {
    name: 'John Doe',
    rating: 4,
    comment: 'Great product!',
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<Review {...defaultProps} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('Great product!')).toBeTruthy();
  });

  it('renders with image URL', () => {
    const { getByTestId } = render(
      <Review {...defaultProps} imageUrl="https://example.com/avatar.jpg" />,
    );
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders with custom name', () => {
    const { getByText } = render(
      <Review {...defaultProps} name="Jane Smith" />,
    );
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('renders with custom rating', () => {
    const { getByText } = render(<Review {...defaultProps} rating={5} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('renders with custom comment', () => {
    const { getByText } = render(
      <Review {...defaultProps} comment="Amazing quality!" />,
    );
    expect(getByText('Amazing quality!')).toBeTruthy();
  });

  it('renders with zero rating', () => {
    const { getByText } = render(<Review {...defaultProps} rating={0} />);
    expect(getByText('0')).toBeTruthy();
  });

  it('renders with decimal rating', () => {
    const { getByText } = render(<Review {...defaultProps} rating={4.5} />);
    expect(getByText('4.5')).toBeTruthy();
  });

  it('renders with long comment', () => {
    const longComment =
      'This is a very long comment that should still be displayed properly in the review component. It contains multiple sentences and should wrap correctly.';
    const { getByText } = render(
      <Review {...defaultProps} comment={longComment} />,
    );
    expect(getByText(longComment)).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { getByText, getByTestId } = render(
      <Review
        name="Alice Johnson"
        imageUrl="https://example.com/alice.jpg"
        rating={5}
        comment="Excellent service and fast delivery!"
      />,
    );

    expect(getByText('Alice Johnson')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('Excellent service and fast delivery!')).toBeTruthy();
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<Review {...defaultProps} />);
    expect(getByTestId('review-item')).toBeTruthy();
  });

  it('renders star icon for rating', () => {
    const { getByTestId } = render(<Review {...defaultProps} />);
    expect(getByTestId('star-icon')).toBeTruthy();
  });
});
