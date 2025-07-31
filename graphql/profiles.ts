import { gql } from '@apollo/client';

export const getProfiles = gql`
  query GetProfiles($filter: profilesFilter, $last: Int) {
    profilesCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          username
          profile_image_url
        }
      }
    }
  }
`;
