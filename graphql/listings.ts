import { gql } from '@apollo/client';

export const insertListings = gql`
  mutation InsertListings($objects: [listingsInsertInput!]!) {
    insertIntolistingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
