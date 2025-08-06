import { gql } from '@apollo/client';

export const getFollows = gql`
  query getFollows($filter: followsFilter) {
    followsCollection(filter: $filter) {
      edges {
        node {
          follower_user {
            id
            username
            profile_image_url
          }
          followee_user {
            id
            username
            profile_image_url
          }
        }
      }
    }
  }
`;

export const createFollows = gql`
  mutation CreateFollows($objects: [followsInsertInput!]!) {
    insertIntofollowsCollection(objects: $objects) {
      records {
        follower_user_id
      }
    }
  }
`;

export const removeFollows = gql`
  mutation RemoveFollows($filter: followsFilter) {
    deleteFromfollowsCollection(filter: $filter) {
      records {
        follower_user_id
      }
    }
  }
`;
