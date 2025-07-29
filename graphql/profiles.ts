import { gql } from '@apollo/client';

export const getPeoples = gql`
  query GetPeoples($filter: profilesFilter, $last: Int) {
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
