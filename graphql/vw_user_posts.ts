import { gql } from '@apollo/client';

export const getVwUserPosts = gql`
  query GetVwUserPosts(
    $filter: vw_user_postsFilter
    $last: Int
    $orderBy: [vw_user_postsOrderBy!]
  ) {
    vw_user_postsCollection(filter: $filter, last: $last, orderBy: $orderBy) {
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
