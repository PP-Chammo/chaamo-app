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

export const updateUserAddress = gql`
  mutation UpdateUserAddress(
    $set: user_addressesUpdateInput!
    $filter: user_addressesFilter
  ) {
    updateuser_addressesCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;
