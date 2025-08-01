import { gql } from '@apollo/client';

export const createCommunityPosts = gql`
  mutation CreateCommunityPosts($objects: [community_postsInsertInput!]!) {
    insertIntocommunity_postsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
