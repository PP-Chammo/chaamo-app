import { gql } from '@apollo/client';

export const getFeaturedListings = gql`
  query GetFeaturedListings($filter: featured_cardsFilter, $last: Int) {
    featured_cardsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
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

export const getAuctionListings = gql`
  query GetAuctionListings($filter: listingsFilter, $last: Int) {
    listingsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          currency
          start_price
          user_cards {
            user_images
            master_cards {
              name
            }
          }
        }
      }
    }
  }
`;

export const getRecentlyAddedListings = gql`
  query GetRecentlyAddedListings($filter: chaamo_cardsFilter, $last: Int) {
    chaamo_cardsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
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

export const createListings = gql`
  mutation CreateListings($objects: [listingsInsertInput!]!) {
    insertIntolistingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
