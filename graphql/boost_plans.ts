import { gql } from '@apollo/client';

export const getBoostPlans = gql`
  query GetBoostPlans($orderBy: [boost_plansOrderBy!]) {
    boost_plansCollection(orderBy: $orderBy) {
      edges {
        node {
          id
          paypal_plan_id
          name
          currency
          price
          boost_days
        }
      }
    }
  }
`;
