import { gql } from '@apollo/client';

export const createReportedPosts = gql`
  mutation CreateReportedPosts($objects: [reported_postsInsertInput!]!) {
    insertIntoreported_postsCollection(objects: $objects) {
      records {
        reporter_user_id
      }
    }
  }
`;
