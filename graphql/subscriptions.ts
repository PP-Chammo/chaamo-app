import { gql } from '@apollo/client';

export const getSubscriptions = gql`
  query GetSubscriptions($filter: subscriptionsFilter!) {
    subscriptionsCollection(filter: $filter) {
      edges {
        node {
          user_id
        }
      }
    }
  }
`;

export const getSubscriptionDetail = gql`
  query GetSubscriptionDetail($filter: subscriptionsFilter!) {
    subscriptionsCollection(filter: $filter) {
      edges {
        node {
          user_id
          start_date
          end_date
          status
          membership_plans {
            name
            description
            benefits
            currency
            price
            subscription_days
            type
          }
        }
      }
    }
  }
`;
