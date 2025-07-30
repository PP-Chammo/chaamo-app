import { gql } from '@apollo/client';

export const createPayments = gql`
  mutation CreatePayments($objects: [paymentsInsertInput!]!) {
    insertIntopaymentsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updatePayments = gql`
  mutation UpdatePayments($set: paymentsUpdateInput!, $filter: paymentsFilter) {
    updatepaymentsCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;
