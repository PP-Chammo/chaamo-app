import { gql } from '@apollo/client';

export const createCard = gql`
  mutation CreateCard($objects: [cardsInsertInput!]!) {
    insertIntocardsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updateCard = gql`
  mutation UpdateCard($set: cardsUpdateInput!, $filter: cardsFilter) {
    updatecardsCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;

export const deleteCard = gql`
  mutation DeleteCard($filter: cardsFilter!) {
    deleteFromcardsCollection(filter: $filter) {
      records {
        id
      }
    }
  }
`;
