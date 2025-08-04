import { gql } from '@apollo/client';

export const getProfiles = gql`
  query GetProfiles($filter: profilesFilter, $last: Int) {
    profilesCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          username
          profile_image_url
          phone_number
          country_code
          currency
        }
      }
    }
  }
`;

export const getPersonalProfile = gql`
  query GetPersonalProfile($filter: user_addressesFilter) {
    user_addressesCollection(filter: $filter) {
      edges {
        node {
          address_line_1
          city
          state_province
          country
          postal_code
          profiles {
            username
            country_code
            phone_number
          }
        }
      }
    }
  }
`;

export const createProfiles = gql`
  mutation CreateProfiles($objects: [profilesInsertInput!]!) {
    insertIntoprofilesCollection(objects: $objects) {
      records {
        id
        username
        profile_image_url
        phone_number
        country_code
        currency
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
