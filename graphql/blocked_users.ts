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
