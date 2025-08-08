import { gql } from '@apollo/client';

export const getVwFeaturedListings = gql`
  query GetVwFeaturedListings($filter: vw_featured_cardsFilter, $last: Int) {
    vw_featured_cardsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          is_favorite
          image_url
          currency
          price
          start_price
          name
        }
      }
    }
  }
`;
