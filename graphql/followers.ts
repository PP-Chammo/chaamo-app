import { gql } from '@apollo/client';

export const getFollowers = gql`
  query GetFollowers($filter: followersFilter, $last: Int) {
    followersCollection(filter: $filter, last: $last) {
      edges {
        node {
          following_user_id
          followed_user_id
        }
      }
    }
  }
`;

export const createFollowers = gql`
  mutation CreateFollowers($objects: [followersInsertInput!]!) {
    insertIntofollowersCollection(objects: $objects) {
      records {
        following_user_id
      }
    }
  }
`;

export const removeFollowers = gql`
  mutation RemoveFollowers($filter: followersFilter) {
    deleteFromfollowersCollection(filter: $filter) {
      records {
        following_user_id
      }
    }
  }
`;
