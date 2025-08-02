import { gql } from '@apollo/client';

export const createBids = gql`
  mutation CreateBids($objects: [bidsInsertInput!]!) {
    insertIntobidsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
