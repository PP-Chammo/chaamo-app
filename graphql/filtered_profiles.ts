import { gql } from '@apollo/client';

export const getVwFilteredProfiles = gql`
  query GetVwFilteredProfiles($filter: vw_filtered_profilesFilter, $last: Int) {
    vw_filtered_profilesCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          username
          profile_image_url
          phone_number
          country_code
          currency
          is_follow
        }
      }
    }
  }
`;
