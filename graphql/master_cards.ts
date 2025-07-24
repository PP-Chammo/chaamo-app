import { gql } from '@apollo/client';

export const getMasterCardsAutocomplete = gql`
  query getMasterCardsAutocomplete($filter: master_cardsFilter, $last: Int) {
    master_cardsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          name
          year
          canonical_image_url
          categories {
            name
            type
          }
        }
      }
    }
  }
`;
