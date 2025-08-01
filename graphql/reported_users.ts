import { gql } from '@apollo/client';

export const createReportedUsers = gql`
  mutation CreateReportedUsers($objects: [reported_usersInsertInput!]!) {
    insertIntoreported_usersCollection(objects: $objects) {
      records {
        reporter_user_id
        reported_user_id
      }
    }
  }
`;
