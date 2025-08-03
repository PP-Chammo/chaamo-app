import { gql } from '@apollo/client';

export const createListings = gql`
  mutation CreateListings($objects: [listingsInsertInput!]!) {
    insertIntolistingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
