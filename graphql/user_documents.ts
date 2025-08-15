import { gql } from '@apollo/client';

export const createUserDocument = gql`
  mutation CreateUserDocument($objects: [user_documentsInsertInput!]!) {
    insertIntouser_documentsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const getUserDocument = gql`
  query GetUserDocument(
    $filter: user_documentsFilter
    $orderBy: [user_documentsOrderBy!]
  ) {
    user_documentsCollection(filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
`;
