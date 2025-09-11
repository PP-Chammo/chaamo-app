import { Fragment, useCallback, useMemo, useState } from 'react';

import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { ScrollView, View } from 'react-native';

import { MasterCard } from '@/assets/svg';
import {
  Button,
  Divider,
  Label,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';
import { useGetVwMyOrdersLazyQuery } from '@/generated/graphql';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isExpandedOrderDetails, setIsExpandedOrderDetails] =
    useState<boolean>(false);
  const [isExpandedPaymentInfo, setIsExpandedPaymentInfo] =
    useState<boolean>(false);

  const [getOrderDetail, { data }] = useGetVwMyOrdersLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const detail = useMemo(
    () => data?.vw_myordersCollection?.edges?.[0]?.node,
    [data],
  );

  console.log(detail);

  useFocusEffect(
    useCallback(() => {
      getOrderDetail({
        variables: {
          filter: {
            id: {
              eq: id,
            },
          },
        },
      });
    }, [getOrderDetail, id]),
  );

  const _renderOrderDetails = useMemo(() => {
    if (isExpandedOrderDetails)
      return (
        <Fragment>
          <Row between>
            <Label>Time Placed</Label>
            <Label>-</Label>
          </Row>
          <Row between>
            <Label>Total</Label>
            <Label>{detail?.final_price}</Label>
          </Row>
          <Row between>
            <Label>Sold By</Label>
            <Link href="/" className={classes.link}>
              John Doe
            </Link>
          </Row>
        </Fragment>
      );

    return null;
  }, [detail?.final_price, isExpandedOrderDetails]);

  const _renderPaymentInfo = useMemo(() => {
    if (isExpandedPaymentInfo)
      return (
        <Fragment>
          <Row between>
            <Label>Item</Label>
            <Label>$ 18.31</Label>
          </Row>
          <Row between>
            <Label>Postage</Label>
            <Label>$ 4.50</Label>
          </Row>
          <Row between>
            <Label>Insurance</Label>
            <Label>$ 3.50</Label>
          </Row>
        </Fragment>
      );

    return null;
  }, [isExpandedPaymentInfo]);

  return (
    <ScreenContainer>
      <Header title="Order Details" onBackPress={router.back} />
      <ScrollView contentContainerClassName="pb-12">
        <View className={classes.container}>
          <View className={classes.section}>
            <Label className={classes.headerTitle}>Order Info.</Label>
            <Row between>
              <Label>Order number</Label>
              <Label>25-12836-90024</Label>
            </Row>
            {_renderOrderDetails}
            <Divider position="horizontal" className={classes.divider} />

            <Button
              variant="link"
              textClassName={classes.buttonText}
              onPress={() => setIsExpandedOrderDetails(!isExpandedOrderDetails)}
            >
              {isExpandedOrderDetails
                ? 'Hide Order Details'
                : 'View Order Details'}
            </Button>
          </View>
          <View className={classes.section}>
            <Label className={classes.headerTitle}>Payment Info.</Label>
            <Row between>
              <Row>
                <MasterCard />
                <Label> **** **** **** 2424</Label>
              </Row>
              <Label variant="subtitle">$21.00</Label>
            </Row>
            {_renderPaymentInfo}
            <Divider position="horizontal" className={classes.divider} />
            {isExpandedPaymentInfo && (
              <Row between>
                <Label variant="subtitle">Total</Label>
                <Label variant="subtitle">$ 21.00</Label>
              </Row>
            )}
            <Button
              variant="link"
              textClassName={classes.buttonText}
              onPress={() => setIsExpandedPaymentInfo(!isExpandedPaymentInfo)}
            >
              {isExpandedPaymentInfo
                ? 'Hide Payment Info'
                : 'View Payment Info'}
            </Button>
          </View>
          <View className={classes.section}>
            <Label className={classes.headerTitle}>Track Package</Label>
            <Row between>
              <Label>Tracking Number</Label>
              <Link href="/" className={classes.link}>
                25-12836-90024
              </Link>
            </Row>
          </View>
          <View className={classes.section}>
            <Label className={classes.headerTitle}>Delivery Info</Label>
            <Row between>
              <Label>Name</Label>
              <Label>Azhar Ali</Label>
            </Row>
            <Row between>
              <Label className={classes.addressLabel}>Address</Label>
              <Label className={classes.addressValue}>
                287a fleet Road Fleet, Hampshire GU513BZ United Kingdom
              </Label>
            </Row>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  section: 'bg-white p-4.5 gap-4',
  headerTitle: 'text-md font-bold',
  divider: '!bg-primary-100',
  buttonText: '!text-primary-600 font-medium',
  link: 'underline font-medium',
  container: 'gap-4',
  addressLabel: 'self-start',
  addressValue: 'w-40 text-right',
};
