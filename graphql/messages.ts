import { gql } from '@apollo/client';

export const getMessages = gql`
  query GetMessages(
    $filter: messagesFilter
    $last: Int
    $orderBy: [messagesOrderBy!]
  ) {
    messagesCollection(filter: $filter, last: $last, orderBy: $orderBy) {
      edges {
        node {
          id
          sender_id
          content
          created_at
        }
      }
    }
  }
`;

export const createMessages = gql`
  mutation CreateMessages($objects: [messagesInsertInput!]!) {
    insertIntomessagesCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updateMessages = gql`
  mutation UpdateMessages($set: messagesUpdateInput!, $filter: messagesFilter) {
    updatemessagesCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;

export const deleteMessages = gql`
  mutation DeleteMessages($filter: messagesFilter!) {
    deleteFrommessagesCollection(filter: $filter) {
      records {
        id
      }
    }
  }
`;
