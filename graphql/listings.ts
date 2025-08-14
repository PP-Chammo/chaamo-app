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

export const updateListings = gql`
  mutation UpdateListings($set: listingsUpdateInput!, $filter: listingsFilter) {
    updatelistingsCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;
