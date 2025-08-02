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
