import { gql } from '@apollo/client';

export const getVwPeoples = gql`
  query GetVwPeoples($filter: vw_peoplesFilter, $last: Int) {
    vw_peoplesCollection(filter: $filter, last: $last) {
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
