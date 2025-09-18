import { gql } from '@apollo/client';

export const getSubscriptions = gql`
  query GetSubscriptions($filter: subscriptionsFilter!) {
    subscriptionsCollection(filter: $filter) {
      edges {
        node {
          user_id
          status
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
          plan_id
          paypal_subscription_id
          payments {
            gateway_account_info
          }
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
