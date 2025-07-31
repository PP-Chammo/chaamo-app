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
