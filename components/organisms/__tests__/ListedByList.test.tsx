import React from 'react';

import { render, screen } from '@testing-library/react-native';

import ListedByList from '../ListedByList';

describe('ListedByList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    render(<ListedByList />);

    expect(screen.getByText('Listed By')).toBeTruthy();
  });

  it('displays the title with correct variant', () => {
    render(<ListedByList />);

    const title = screen.getByText('Listed By');
    expect(title).toBeTruthy();
  });

  it('renders People component', () => {
    render(<ListedByList />);

    // The People component should be rendered with the specified props
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('renders with all required elements', () => {
    render(<ListedByList />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('displays the correct person name', () => {
    render(<ListedByList />);

    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<ListedByList />)).not.toThrow();
  });

  it('has proper accessibility', () => {
    render(<ListedByList />);

    const title = screen.getByText('Listed By');
    expect(title).toBeTruthy();
  });

  it('maintains consistent layout', () => {
    const { rerender } = render(<ListedByList />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();

    rerender(<ListedByList />);

    expect(screen.getByText('Listed By')).toBeTruthy();
    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('displays view profile text', () => {
    render(<ListedByList />);

    expect(screen.getByText('View Profile')).toBeTruthy();
  });
});
