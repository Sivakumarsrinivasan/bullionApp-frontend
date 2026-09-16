import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {getOrder} from '../types/order';
import {getMyOrders} from '../services/order.service';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'MyOrders'
>;

type OrderType = 'ALL' | 'BUY' | 'SELL';

const MyOrdersScreen = ({navigation}: Props) => {
  const {colors} = useTheme();

  const [selectedType, setSelectedType] =
    useState<OrderType>('ALL');

  const [orders, setOrders] = useState<getOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getMyOrders(1, 10);

      // console.log('MY ORDERS RESPONSE:', response);

      setOrders(response?.data?.orders || []);
    } catch (err: any) {
      console.log(
        'MY ORDERS ERROR:',
        err?.response?.data || err?.response,
      );

      setError(
        err?.response?.data?.message ||
          'Unable to fetch orders',
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on selected BUY / SELL
  const filteredOrders = useMemo(() => {
    if (selectedType === 'ALL') {
      return orders;
    }

    return orders.filter(
      order =>
        order.order_type?.toUpperCase() === selectedType,
    );
  }, [orders, selectedType]);

  const formatPrice = (value: string | number) => {
    return Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatQuantity = (value: string | number) => {
    return Number(value || 0).toFixed(3);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    return status?.toUpperCase() || 'PENDING';
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              {backgroundColor: colors.surface},
            ]}>
            <Text
              style={[
                styles.backText,
                {color: colors.text},
              ]}>
              ‹
            </Text>
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {color: colors.text},
            ]}>
            My Orders
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Filter */}
        <View
          style={[
            styles.filterContainer,
            {backgroundColor: colors.surface},
          ]}>
          {(['ALL', 'BUY', 'SELL'] as OrderType[]).map(
            type => (
              <Pressable
                key={type}
                onPress={() => setSelectedType(type)}
                style={[
                  styles.filterButton,
                  selectedType === type && {
                    backgroundColor: colors.primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        selectedType === type
                          ? colors.white
                          : colors.textSecondary,
                    },
                  ]}>
                  {type}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text
              style={[
                styles.loadingText,
                {color: colors.textSecondary},
              ]}>
              Loading orders...
            </Text>
          </View>
        )}

        {/* Error */}
        {!loading && error !== '' && (
          <View style={styles.centerContainer}>
            <Text
              style={[
                styles.errorIcon,
                {color: colors.error},
              ]}>
              !
            </Text>

            <Text
              style={[
                styles.errorTitle,
                {color: colors.text},
              ]}>
              Something went wrong
            </Text>

            <Text
              style={[
                styles.errorText,
                {color: colors.textSecondary},
              ]}>
              {error}
            </Text>

            <Pressable
              onPress={loadOrders}
              style={[
                styles.retryButton,
                {backgroundColor: colors.primary},
              ]}>
              <Text
                style={[
                  styles.retryButtonText,
                  {color: colors.white},
                ]}>
                Try Again
              </Text>
            </Pressable>
          </View>
        )}

        {/* Orders */}
        {!loading &&
          error === '' &&
          filteredOrders.length > 0 &&
          filteredOrders.map(order => (
            <View
              key={order.id}
              style={[
                styles.orderCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>

              {/* Top row */}
              <View style={styles.orderHeader}>
                <View>
                  <Text
                    style={[
                      styles.orderId,
                      {color: colors.text},
                    ]}>
                    Order #{order.id}
                  </Text>

                  <Text
                    style={[
                      styles.orderDate,
                      {color: colors.textSecondary},
                    ]}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        order.order_type === 'BUY'
                          ? colors.primaryLight
                          : colors.surface,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color:
                          order.order_type === 'BUY'
                            ? colors.primary
                            : colors.textSecondary,
                      },
                    ]}>
                    {order.order_type}
                  </Text>
                </View>
              </View>

              {/* Product */}
              <View
                style={[
                  styles.productSection,
                  {borderColor: colors.border},
                ]}>
                <Text
                  style={[
                    styles.productLabel,
                    {color: colors.textSecondary},
                  ]}>
                  Product
                </Text>

                <Text
                  style={[
                    styles.productValue,
                    {color: colors.text},
                  ]}>
                  Product #{order.product_id}
                </Text>
              </View>

              {/* Order details */}
              <View style={styles.detailsContainer}>

                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.textSecondary},
                    ]}>
                    Quantity
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.text},
                    ]}>
                    {formatQuantity(order.quantity)}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.detailLabel,
                      {color: colors.textSecondary},
                    ]}>
                    Price
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      {color: colors.text},
                    ]}>
                    ₹{formatPrice(order.price)}
                  </Text>
                </View>

              </View>

              {/* Total */}
              <View
                style={[
                  styles.totalSection,
                  {borderColor: colors.border},
                ]}>
                <Text
                  style={[
                    styles.totalLabel,
                    {color: colors.textSecondary},
                  ]}>
                  Total Amount
                </Text>

                <Text
                  style={[
                    styles.totalValue,
                    {color: colors.primary},
                  ]}>
                  ₹{formatPrice(order.total_amount)}
                </Text>
              </View>

              {/* Status */}
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusLabel,
                    {color: colors.textSecondary},
                  ]}>
                  Status
                </Text>

                <Text
                  style={[
                    styles.statusValue,
                    {color: colors.success},
                  ]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
          ))}

        {/* No orders */}
        {!loading &&
          error === '' &&
          filteredOrders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyIcon,
                  {color: colors.primary},
                ]}>
                ₹
              </Text>

              <Text
                style={[
                  styles.emptyTitle,
                  {color: colors.text},
                ]}>
                No Orders Found
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {color: colors.textSecondary},
                ]}>
                {selectedType === 'ALL'
                  ? 'Your BUY and SELL orders will appear here.'
                  : `You don't have any ${selectedType} orders yet.`}
              </Text>

              <Pressable
                onPress={() => navigation.goBack()}
                style={[
                  styles.startButton,
                  {backgroundColor: colors.primary},
                ]}>
                <Text
                  style={[
                    styles.startButtonText,
                    {color: colors.white},
                  ]}>
                  Explore Products
                </Text>
              </Pressable>
            </View>
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpace: {
    width: 42,
  },

  filterContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 9,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '700',
  },

  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  errorIcon: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 12,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },

  retryButton: {
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },

  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  orderCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderId: {
    fontSize: 16,
    fontWeight: '700',
  },

  orderDate: {
    fontSize: 12,
    marginTop: 4,
  },

  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  productSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
    marginTop: 14,
    marginBottom: 14,
  },

  productLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  productValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    marginBottom: 5,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  totalSection: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 14,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  statusLabel: {
    fontSize: 13,
  },

  statusValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  startButton: {
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },

  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default MyOrdersScreen;