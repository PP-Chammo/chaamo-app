import { gql } from '@apollo/client';

export const getFavoriteCaches = gql`
  query GetFavoriteCaches($filter: favoritesFilter, $last: Int) {
    favoritesCollection(filter: $filter, last: $last) {
      edges {
        node {
          user_id
          listing_id
        }
      }
    }
  }
`;

export const getFavorites = gql`
  query GetFavorites($filter: favoritesFilter, $last: Int) {
    favoritesCollection(filter: $filter, last: $last) {
      edges {
        node {
          listing_id
        }
      }
    }
  }
`;

export const createFavorites = gql`
  mutation CreateFavorites($objects: [favoritesInsertInput!]!) {
    insertIntofavoritesCollection(objects: $objects) {
      records {
        user_id
        listing_id
      }
    }
  }
`;

export const removeFavorites = gql`
  mutation RemoveFavorites($filter: favoritesFilter) {
    deleteFromfavoritesCollection(filter: $filter) {
      records {
        user_id
        listing_id
      }
    }
  }
`;
