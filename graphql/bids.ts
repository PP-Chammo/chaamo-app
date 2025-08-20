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

export const updateBids = gql`
  mutation UpdateBids(
    $set: bidsUpdateInput!
    $filter: bidsFilter
    $atMost: Int
  ) {
    updatebidsCollection(set: $set, filter: $filter, atMost: $atMost) {
      records {
        id
        status
      }
    }
  }
`;
