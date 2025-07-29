import { gql } from '@apollo/client';

export const getFeaturedListings = gql`
  query GetFeaturedListings($filter: listingsFilter, $last: Int) {
    listingsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          currency
          price
          user_cards {
            user_images
            master_cards {
              name
            }
          }
          ebay_posts {
            image_url
            title
          }
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
  query GetRecentlyAddedListings($filter: listingsFilter, $last: Int) {
    listingsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          currency
          price
          user_cards {
            user_images
            master_cards {
              name
            }
          }
          ebay_posts {
            image_url
            title
          }
        }
      }
    }
  }
`;

export const insertListings = gql`
  mutation InsertListings($objects: [listingsInsertInput!]!) {
    insertIntolistingsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;
