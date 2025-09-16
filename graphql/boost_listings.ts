import { gql } from '@apollo/client';

export const createBoostListings = gql`
  mutation CreateBoostListings($objects: [boost_listingsInsertInput!]!) {
    insertIntoboost_listingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
