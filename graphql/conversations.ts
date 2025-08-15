import { gql } from '@apollo/client';

export const createConversations = gql`
  mutation CreateConversations($objects: [conversationsInsertInput!]!) {
    insertIntoconversationsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updateConversations = gql`
  mutation UpdateConversations(
    $set: conversationsUpdateInput!
    $filter: conversationsFilter
  ) {
    updateconversationsCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;
