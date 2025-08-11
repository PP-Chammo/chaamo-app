import { gql } from '@apollo/client';

export const getBlockedUserCaches = gql`
  query GetBlockedUserCaches($filter: blocked_usersFilter!) {
    blocked_usersCollection(filter: $filter) {
      edges {
        node {
          blocker_user_id
          blocked_user_id
        }
      }
    }
  }
`;

export const getBlockedUsers = gql`
  query GetBlockedUsers(
    $filter: blocked_usersFilter!
    $first: Int
    $last: Int
  ) {
    blocked_usersCollection(filter: $filter, first: $first, last: $last) {
      edges {
        node {
          blocker_user_id
          blocked_user_id
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
