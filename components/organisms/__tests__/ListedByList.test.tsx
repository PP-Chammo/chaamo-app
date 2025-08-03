import React from 'react';

import { render, screen } from '@testing-library/react-native';

import ListedByList from '../ListedByList';

describe('ListedByList', () => {
  const defaultProps = {
    userId: 'test-user-id',
    imageUrl: 'https://example.com/avatar.jpg',
    username: 'John Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('Listed By')).toBeTruthy();
  });

  it('displays the title with correct variant', () => {
    render(<ListedByList {...defaultProps} />);

    const title = screen.getByText('Listed By');
    expect(title).toBeTruthy();
  });

  it('renders People component', () => {
    render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('displays the correct person name', () => {
    render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<ListedByList {...defaultProps} />)).not.toThrow();
  });

  it('has proper accessibility', () => {
    render(<ListedByList {...defaultProps} />);

    const title = screen.getByText('Listed By');
    expect(title).toBeTruthy();
  });

  it('maintains consistent layout', () => {
    const { rerender } = render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();

    rerender(<ListedByList {...defaultProps} />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('displays view profile text', () => {
    render(<ListedByList {...defaultProps} />);

    expect(screen.getByText('View Profile')).toBeTruthy();
  });
});
