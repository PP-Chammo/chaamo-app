import { gql } from '@apollo/client';

export const getUserAddresses = gql`
  query GetUserAddresses($filter: user_addressesFilter) {
    user_addressesCollection(filter: $filter) {
      edges {
        node {
          address_line_1
          city
          state_province
          country
          postal_code
        }
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
