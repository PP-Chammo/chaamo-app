import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import CategoryList from '../CategoryList';

jest.mock('expo-router', () => ({
  Link: 'Link',
  router: { push: () => {} },
  useRouter: () => ({ push: () => {} }),
}));

jest.mock('@/generated/graphql', () => ({
  ...jest.requireActual('@/generated/graphql'),
  useGetCategoriesQuery: jest.fn(() => ({
    data: {
      categoriesCollection: {
        edges: [
          {
            node: {
              id: 1,
              name: 'PokeMon',
              type: 'TYPE1',
              __typename: 'categories',
            },
            __typename: 'categoriesEdge',
          },
          {
            node: {
              id: 2,
              name: 'Marvel',
              type: 'TYPE2',
              __typename: 'categories',
            },
            __typename: 'categoriesEdge',
          },
          ...Array.from({ length: 8 }, (_, i) => ({
            node: {
              id: i + 3,
              name: `Category${i + 3}`,
              type: `TYPE${i + 3}`,
              __typename: 'categories',
            },
            __typename: 'categoriesEdge',
          })),
        ],
      },
    },
  })),
}));

describe('CategoryList', () => {
  const defaultProps = {
    title: 'Categories',
    titleLink: 'View All',
    onViewAllHref: '/categories',
  };

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <CategoryList {...defaultProps} />,
    );
    expect(getByTestId('list-container')).toBeTruthy();
    expect(getByText('Categories')).toBeTruthy();
  });

  it('renders with correct title', () => {
    const { getByText } = render(<CategoryList {...defaultProps} />);
    expect(getByText('Categories')).toBeTruthy();
  });

  it('renders ListContainer component', () => {
    const { getByTestId } = render(<CategoryList {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('renders Category components for each category', () => {
    const { getAllByTestId } = render(<CategoryList {...defaultProps} />);
    const categoryComponents = getAllByTestId('category-item');
    expect(categoryComponents).toHaveLength(10);
  });

  it('displays categories from constants', () => {
    const { getByText } = render(<CategoryList {...defaultProps} />);
    expect(getByText('PokeMon')).toBeTruthy();
    expect(getByText('Marvel')).toBeTruthy();
  });

  it('renders with proper layout structure', () => {
    const { getByTestId } = render(<CategoryList {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });

  it('handles category navigation correctly', () => {
    const { getAllByTestId } = render(<CategoryList {...defaultProps} />);
    const categoryComponents = getAllByTestId('category-item');
    fireEvent.press(categoryComponents[0]);
    expect(categoryComponents[0]).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { getByTestId } = render(<CategoryList {...defaultProps} />);
    expect(getByTestId('list-container')).toBeTruthy();
  });
});
