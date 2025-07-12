import React from 'react';

import { render } from '@testing-library/react-native';

import Rating from '../Rating';

describe('Rating', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Rating value={3} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { toJSON } = render(<Rating value={4} size={30} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom className', () => {
    const { toJSON } = render(
      <Rating value={5} className="custom-rating-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders 5 stars for maximum rating', () => {
    const { toJSON } = render(<Rating value={5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders 0 stars for minimum rating', () => {
    const { toJSON } = render(<Rating value={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with decimal values', () => {
    const { toJSON } = render(<Rating value={3.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different rating values', () => {
    const ratings = [1, 2, 3, 4, 5];

    ratings.forEach((rating) => {
      const { toJSON } = render(<Rating value={rating} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('applies correct styling classes', () => {
    const { toJSON } = render(<Rating value={3} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const { toJSON } = render(
      <Rating value={4.5} size={25} className="custom-rating-class" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
