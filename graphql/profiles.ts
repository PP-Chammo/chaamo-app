import { gql } from '@apollo/client';

export const getProfiles = gql`
  query GetProfiles($filter: profilesFilter, $last: Int, $first: Int) {
    profilesCollection(filter: $filter, last: $last, first: $first) {
      edges {
        node {
          id
          username
          profile_image_url
          phone_number
          country_code
          currency
          created_at
          is_profile_complete
          is_admin
        }
      }
    }
  }
`;

export const updateProfile = gql`
  mutation UpdateProfile($set: profilesUpdateInput!, $filter: profilesFilter) {
    updateprofilesCollection(set: $set, filter: $filter) {
      records {
        id
        username
      }
    }
  }
`;
