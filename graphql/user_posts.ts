import { gql } from '@apollo/client';

export const getUserPosts = gql`
  query GetUserPosts($filter: user_postsFilter, $last: Int) {
    user_postsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          user_id
          username
          profile_image_url
          content_image_url
          like_count
          liked
          content
          created_at
        }
      }
    }
  }
`;
