import { gql } from '@apollo/client';

export const getUserAddresses = gql`
  query GetUserAddresses($filter: user_addressesFilter) {
    user_addressesCollection(filter: $filter) {
      edges {
        node {
          user_addresses_id: id
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

export const createUserAddress = gql`
  mutation CreateUserAddress($objects: [user_addressesInsertInput!]!) {
    insertIntouser_addressesCollection(objects: $objects) {
      records {
        id
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
