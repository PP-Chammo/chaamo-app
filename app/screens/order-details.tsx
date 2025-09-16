import React, { Fragment, useCallback, useMemo, useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { toLower, upperFirst } from 'lodash';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import {
  Button,
  Divider,
  Label,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header } from '@/components/molecules';
import { useGetVwMyOrdersLazyQuery } from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';

export default function OrderDetailsScreen() {
  const [user] = useUserVar();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { formatDisplay } = useCurrencyDisplay();

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

  const isSeller = useMemo(() => {
    return detail?.seller_id === user?.id;
  }, [detail?.seller_id, user?.id]);

  const gateway_info = useMemo(() => {
    return JSON.parse(detail?.gateway_account_info ?? '{}');
  }, [detail?.gateway_account_info]);

  const handleRedirectSellerProfile = useCallback(() => {
    router.push({
      pathname: '/screens/profile',
      params: {
        userId: isSeller ? detail?.buyer_id : detail?.seller_id,
      },
    });
  }, [detail?.buyer_id, detail?.seller_id, isSeller]);

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
            <Label>Time placed</Label>
            <Label>
              {format(new Date(detail?.created_at), 'dd/MM/yyyy HH:mm')}
            </Label>
          </Row>
          <Row between>
            <Label>Item</Label>
            <Label>
              {formatDisplay(detail?.currency, detail?.seller_earnings)}
            </Label>
          </Row>
          <Row between>
            <Label>{isSeller ? 'Sold to' : 'Sold by'}</Label>
            <TouchableOpacity onPress={handleRedirectSellerProfile}>
              <Label className={classes.linkText}>
                {isSeller ? detail?.buyer_username : detail?.seller_username}
              </Label>
            </TouchableOpacity>
          </Row>
        </Fragment>
      );

    return null;
  }, [
    detail?.buyer_username,
    detail?.created_at,
    detail?.currency,
    detail?.seller_earnings,
    detail?.seller_username,
    formatDisplay,
    handleRedirectSellerProfile,
    isExpandedOrderDetails,
    isSeller,
  ]);

  const _renderPaymentInfo = useMemo(() => {
    if (isExpandedPaymentInfo)
      return (
        <Fragment>
          <Row between>
            <Label>Item</Label>
            <Label>
              {formatDisplay(detail?.currency, detail?.seller_earnings)}
            </Label>
          </Row>
          <Row between>
            <Label>Shipping</Label>
            <Label>
              {formatDisplay(detail?.currency, detail?.shipping_fee)}
            </Label>
          </Row>
          <Row between>
            <Label>Insurance</Label>
            <Label>
              {formatDisplay(detail?.currency, detail?.insurance_fee)}
            </Label>
          </Row>
        </Fragment>
      );

    return null;
  }, [
    detail?.currency,
    detail?.insurance_fee,
    detail?.seller_earnings,
    detail?.shipping_fee,
    formatDisplay,
    isExpandedPaymentInfo,
  ]);

  return (
    <ScreenContainer>
      <Header title="Order Details" onBackPress={router.back} />
      <ScrollView contentContainerClassName="pb-12">
        <View className={classes.container}>
          <View className={classes.section}>
            <Label className={classes.headerTitle}>Order Info.</Label>
            <Row between>
              <Label>Order number</Label>
              <Label>{detail?.id}</Label>
            </Row>
            <Row between>
              <Label>Status</Label>
              <Label>
                {upperFirst(toLower(detail?.status?.replace(/_/g, ' ') ?? ''))}
              </Label>
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
                <Row>
                  <MaterialIcons name="paypal" size={24} color="black" />
                </Row>
                <Label>{gateway_info?.email}</Label>
              </Row>
              <Label variant="subtitle">
                {formatDisplay(detail?.currency, detail?.final_price)}
              </Label>
            </Row>
            {_renderPaymentInfo}
            <Divider position="horizontal" className={classes.divider} />
            {isExpandedPaymentInfo && (
              <Row between>
                <Label variant="subtitle">Total</Label>
                <Label variant="subtitle">
                  {formatDisplay(detail?.currency, detail?.final_price)}
                </Label>
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
          {detail?.status === 'shipped' && (
            <View className={classes.section}>
              <Label className={classes.headerTitle}>Track Package</Label>
              <Row between>
                <Label>Tracking Number</Label>
                <Link href="/" className={classes.linkText}>
                  {detail?.shipping_tracking_number}
                </Link>
              </Row>
            </View>
          )}
          {detail?.status === 'delivered' && (
            <View className={classes.section}>
              <Label className={classes.headerTitle}>Delivery Info</Label>
              <Row between>
                <Label>Name</Label>
                <Label>{user?.profile?.username}</Label>
              </Row>
              <Row between>
                <Label className={classes.addressLabel}>Address</Label>
                <Label className={classes.addressValue}>
                  {JSON.parse(detail?.shipping_address)}
                </Label>
              </Row>
            </View>
          )}
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
  linkText: 'underline font-medium',
  container: 'gap-4',
  addressLabel: 'self-start',
  addressValue: 'w-40 text-right',
};
