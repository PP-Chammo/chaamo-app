import { gql } from '@apollo/client';

export const getFavorites = gql`
  query GetFavorites($filter: favorite_listingsFilter, $last: Int) {
    favorite_listingsCollection(filter: $filter, last: $last) {
      edges {
        node {
          listing_id
        }
      }
    }
  }
`;

export const insertFavorites = gql`
  mutation InsertFavorites($objects: [favorite_listingsInsertInput!]!) {
    insertIntofavorite_listingsCollection(objects: $objects) {
      records {
        listing_id
      }
    }
  }
`;

export const removeFavorites = gql`
  mutation RemoveFavorites($filter: favorite_listingsFilter) {
    deleteFromfavorite_listingsCollection(filter: $filter) {
      records {
        listing_id
      }
    }
  }
`;
