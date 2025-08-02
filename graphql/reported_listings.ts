import { gql } from '@apollo/client';

export const createReportedListings = gql`
  mutation CreateReportedListings($objects: [reported_listingsInsertInput!]!) {
    insertIntoreported_listingsCollection(objects: $objects) {
      records {
        reporter_user_id
      }
    }
  }
`;
