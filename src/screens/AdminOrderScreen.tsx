
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useFocusEffect} from '@react-navigation/native';

import {useTheme} from '../theme/ThemeProvider';
import {
  getAdminOrders,
} from '../services/order.service';

import {RootStackParamList} from '../navigations/AppNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminOrders'
>;

type Order = {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  metal_type: string;
  purity: number;
  unit: string;
  product_rate_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: string | number;
  price: string | number;
  total_amount: string | number;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'CANCELLED';
  created_at: string;
  updated_at: string;
};

const AdminOrdersScreen = ({
  navigation,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async (
    pageNumber = 1,
    append = false,
  ) => {
    try {
      if (pageNumber === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getAdminOrders(
        pageNumber,
        10,
      );

      const newOrders =
        response?.data?.orders || [];

      const pagination =
        response?.data?.pagination;

      if (append) {
        setOrders(current => [
          ...current,
          ...newOrders,
        ]);
      } else {
        setOrders(newOrders);
      }

      if (pagination) {
        setPage(pagination.page);

        setHasMore(
          pagination.page <
            pagination.totalPages,
        );
      } else {
        setHasMore(
          newOrders.length === 10,
        );
      }
    } catch (error) {
      console.log(
        'Get admin orders error:',
        error,
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders(1, false);
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders(1, false);
  };

  const handleLoadMore = () => {
    if (
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    loadOrders(page + 1, true);
  };

  const getStatusStyle = (
    status: Order['status'],
  ) => {
    switch (status) {
      case 'PENDING':
        return {
          backgroundColor: '#FFF3CD',
          color: '#856404',
        };

      case 'CONFIRMED':
        return {
          backgroundColor: '#D1ECF1',
          color: '#0C5460',
        };

      case 'PROCESSING':
        return {
          backgroundColor: '#E2D9F3',
          color: '#59359A',
        };

      case 'COMPLETED':
        return {
          backgroundColor: '#D4EDDA',
          color: '#155724',
        };

      case 'CANCELLED':
        return {
          backgroundColor: '#F8D7DA',
          color: '#721C24',
        };

      default:
        return {
          backgroundColor: colors.background,
          color: colors.text,
        };
    }
  };

  const renderOrder = ({
    item,
  }: {
    item: Order;
  }) => {
    const statusStyle = getStatusStyle(
      item.status,
    );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(
            'AdminOrderDetails',
            {
              orderId: item.id,
            },
          )
        }
        style={[
          styles.orderCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>

        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text
              style={[
                styles.orderId,
                {color: colors.text},
              ]}>
              Order #{item.id}
            </Text>

            <Text
              style={[
                styles.date,
                {color: colors.textSecondary},
              ]}>
              {new Date(
                item.created_at,
              ).toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusStyle.backgroundColor,
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color: statusStyle.color,
                },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Product */}
        <View style={styles.productSection}>
          <Text
            style={[
              styles.productName,
              {color: colors.text},
            ]}>
            {item.product_name}
          </Text>

          <Text
            style={[
              styles.productMeta,
              {color: colors.textSecondary},
            ]}>
            {item.metal_type} • Purity{' '}
            {item.purity} • {item.unit}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text
              style={[
                styles.detailLabel,
                {color: colors.textSecondary},
              ]}>
              Type
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    item.order_type === 'BUY'
                      ? colors.primary
                      : colors.text,
                },
              ]}>
              {item.order_type}
            </Text>
          </View>

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
              {item.quantity}
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
              ₹{Number(item.price).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View
          style={[
            styles.totalRow,
            {
              borderTopColor:
                colors.border,
            },
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
              {color: colors.text},
            ]}>
            ₹
            {Number(
              item.total_amount,
            ).toLocaleString()}
          </Text>
        </View>

        {/* View */}
        <Text
          style={[
            styles.viewText,
            {color: colors.primary},
          ]}>
          View Details →
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {color: colors.text},
          ]}>
          Loading orders...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor:
                colors.card,
            },
          ]}
          onPress={() =>
            navigation.goBack()
          }>
          <Text
            style={[
              styles.backText,
              {color: colors.text},
            ]}>
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.title,
              {color: colors.text},
            ]}>
            Admin Orders
          </Text>

          <Text
            style={[
              styles.subtitle,
              {color: colors.textSecondary},
            ]}>
            Manage customer orders
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor:
                colors.card,
            },
          ]}
          onPress={toggleTheme}>
          <Text style={{fontSize: 18}}>
            {mode === 'light'
              ? '🌙'
              : '☀️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={orders}
        keyExtractor={item =>
          String(item.id)
        }
        renderItem={renderOrder}
        contentContainerStyle={
          orders.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              📦
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
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              There are no customer orders
              available.
            </Text>
          </View>
        }

ListFooterComponent={
  loadingMore ? (
    <View style={styles.footerLoader}>
      <ActivityIndicator color={colors.primary} />
    </View>
  ) : undefined
}


      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 35,
  },

  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  orderCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderId: {
    fontSize: 17,
    fontWeight: '700',
  },

  date: {
    fontSize: 11,
    marginTop: 4,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  productSection: {
    marginTop: 16,
  },

  productName: {
    fontSize: 17,
    fontWeight: '700',
  },

  productMeta: {
    fontSize: 12,
    marginTop: 4,
  },

  detailsRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 14,
  },

  totalLabel: {
    fontSize: 13,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  viewText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'right',
  },

  footerLoader: {
    paddingVertical: 20,
  },

  empty: {
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default AdminOrdersScreen;
