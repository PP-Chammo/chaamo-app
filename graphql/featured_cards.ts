import { gql } from '@apollo/client';

export const getVwFeaturedListings = gql`
  query GetVwFeaturedListings($filter: vw_featured_cardsFilter, $last: Int) {
    vw_featured_cardsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          image_url
          currency
          start_price
          name
        }
      }
    }
  }
`;
