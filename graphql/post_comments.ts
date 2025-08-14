import { gql } from '@apollo/client';

export const getPostComments = gql`
  query GetPostComments(
    $filter: post_commentsFilter
    $last: Int
    $orderBy: [post_commentsOrderBy!]
  ) {
    post_commentsCollection(filter: $filter, last: $last, orderBy: $orderBy) {
      edges {
        node {
          id
          profiles {
            username
            profile_image_url
          }
          post_id
          content
          created_at
        }
      }
    }
  }
`;

export const createPostComments = gql`
  mutation CreatePostComments($objects: [post_commentsInsertInput!]!) {
    insertIntopost_commentsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
