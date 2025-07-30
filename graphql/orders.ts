import { gql } from '@apollo/client';

export const createOrders = gql`
  mutation CreateOrders($objects: [ordersInsertInput!]!) {
    insertIntoordersCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
