import { gql } from '@apollo/client';

export const getCategories = gql`
  query GetCategories {
    categoriesCollection {
      edges {
        node {
          id
          name
          type
        }
      }
    }
  }
`;
