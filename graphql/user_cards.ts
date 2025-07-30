import { gql } from '@apollo/client';

export const createUserCard = gql`
  mutation CreateUserCard($objects: [user_cardsInsertInput!]!) {
    insertIntouser_cardsCollection(objects: $objects) {
      records {
        id
      }
    }
  }
`;

export const updateUserCard = gql`
  mutation UpdateUserCard(
    $set: user_cardsUpdateInput!
    $filter: user_cardsFilter
  ) {
    updateuser_cardsCollection(set: $set, filter: $filter) {
      records {
        id
      }
    }
  }
`;
