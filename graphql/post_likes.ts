import { gql } from '@apollo/client';

export const createPostLikes = gql`
  mutation CreatePostLikes($objects: [post_likesInsertInput!]!) {
    insertIntopost_likesCollection(objects: $objects) {
      records {
        post_id
      }
    }
  }
`;

export const removePostLikes = gql`
  mutation RemovePostLikes($filter: post_likesFilter) {
    deleteFrompost_likesCollection(filter: $filter) {
      records {
        post_id
      }
    }
  }
`;
