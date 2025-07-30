import { gql } from '@apollo/client';

export const createBoostedListings = gql`
  mutation CreateBoostedListings($objects: [boosted_listingsInsertInput!]!) {
    insertIntoboosted_listingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
