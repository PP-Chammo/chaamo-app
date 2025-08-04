import { gql } from '@apollo/client';

export const createBlockedUsers = gql`
  mutation CreateBlockedUsers($objects: [blocked_usersInsertInput!]!) {
    insertIntoblocked_usersCollection(objects: $objects) {
      records {
        blocked_user_id
      }
    }
  }
`;

export const removeBlockedUsers = gql`
  mutation RemoveBlockedUsers($filter: blocked_usersFilter!) {
    deleteFromblocked_usersCollection(filter: $filter) {
      records {
        blocked_user_id
      }
    }
  }
`;

export const getBlockedAccounts = gql`
  query GetBlockedAccounts($filter: blocked_usersFilter!) {
    blocked_usersCollection(filter: $filter) {
      edges {
        node {
          profiles {
            id
            username
            profile_image_url
          }
        }
      }
    }
  }
`;
