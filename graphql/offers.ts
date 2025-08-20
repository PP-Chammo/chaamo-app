import { gql } from '@apollo/client';

export const createOffers = gql`
  mutation CreateOffers($objects: [offersInsertInput!]!) {
    insertIntooffersCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updateOffers = gql`
  mutation UpdateOffers(
    $set: offersUpdateInput!
    $filter: offersFilter
    $atMost: Int
  ) {
    updateoffersCollection(set: $set, filter: $filter, atMost: $atMost) {
      records {
        id
        status
      }
    }
  }
`;
